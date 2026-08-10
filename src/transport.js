import { full } from "./constants/uuids.js";

export class Transport {
	#peripheral;
	#characteristics;
	#discovery;
	#queue;

	constructor(peripheral) {
		this.#peripheral = peripheral;
		this.#characteristics = null;
		this.#discovery = null;
		this.#queue = Promise.resolve();

		// Reset transport every time the peripheral is disconnected
		peripheral.on("disconnect", () => {
			this.#characteristics = null;
			this.#discovery = null;
			this.#queue = Promise.resolve();
		});
	}

	// Ensures all characteristics have been discovered and cached before resolving.
	#ensureDiscovered() {
		if (!this.#discovery) {
			const discovery = this.#peripheral
				.discoverAllServicesAndCharacteristicsAsync()
				.then(({ characteristics }) => {
					if (this.#discovery !== discovery) return; // ignore a stale result
					this.#characteristics = new Map(characteristics.map((c) => [c.uuid.toLowerCase(), c]));
				})
				.catch((err) => {
					if (this.#discovery === discovery) this.#discovery = null; // only clear if we're still the current discovery
					throw err;
				});

			this.#discovery = discovery;
		}

		return this.#discovery;
	}

	// Search for a Noble characteristic using its UUID.
	async #find(shortUuid) {
		if (this.#peripheral.state !== "connected") throw new Error("Not connected to this brush!");
		await this.#ensureDiscovered(); // prepare the characteristics first (if not ready)

		// a disconnect could've happened (which resets characteristics), so re-check.
		if (this.#peripheral.state !== "connected" || !this.#characteristics) throw new Error("Not connected to this brush!");

		const characteristic = this.#characteristics.get(full(shortUuid));
		if (!characteristic) throw new Error(`This command is not supported by this brush (characteristic ${shortUuid} not found)!`);

		return characteristic;
	}

	// Add an operation to the queue (to ensure one at a time).
	#enqueue(fn) {
		const run = this.#queue.then(fn, fn); // wait for previous, then run this operation
		this.#queue = run.then(
			() => {},
			() => {},
		); // always resolve so a failure can't block the next operation

		return run; // return this operation's result
	}

	// Write to one or more characteristics, in order.
	writeSequence(writes) {
		return this.#enqueue(async () => {
			for (const { uuid, bytes } of writes) {
				const characteristic = await this.#find(uuid);
				await characteristic.writeAsync(Buffer.from(bytes), true);
			}
		});
	}

	// Subscribe to a characteristic's notifications (and return unsubscribe function).
	subscribe(shortUuid, onData) {
		return this.#enqueue(async () => {
			const characteristic = await this.#find(shortUuid);
			const onNotify = (data) => onData(data);

			// subscribe first, then attach the listener (so a failed subscribe doesn't leak it)
			await characteristic.subscribeAsync();
			characteristic.on("data", onNotify);

			// return an unsubscribe function that can be used later
			return async () => {
				characteristic.removeListener("data", onNotify);
				await characteristic.unsubscribeAsync();
			};
		});
	}

	// Request a read from a characteristic.
	read(shortUuid) {
		return this.#enqueue(async () => {
			const characteristic = await this.#find(shortUuid);
			return characteristic.readAsync();
		});
	}
}
