import { EventEmitter } from "node:events";
import { BrushModel } from "./definitions/brushModel.js";
import { Protocol } from "./definitions/protocol.js";
import { AccessControl } from "./definitions/accessControl.js";
import { withTimeout } from "./utils/helpers.js";
import { Transport } from "./transport.js";
import { OUTGOING, INCOMING } from "./commands/index.js";

// src\main\java\codes\alchemy\oralb\blesdk\devices\model\Brush.java
const ACCESS_CONTROLLED_PROTOCOLS = [Protocol.V007, Protocol.V008, Protocol.V009];

export class Brush extends EventEmitter {
	#model;
	#unsubscribers;
	#connecting;

	constructor(peripheral) {
		super();

		this.peripheral = peripheral;
		this.#model = BrushModel.fromByte(peripheral?.advertisement?.manufacturerData?.[3]);
		this.#unsubscribers = new Map();

		this.deviceName = this.#model?.brush?.name || "Unknown";
		this.deviceType = this.#model?.type || null;
		this.isiO = this.#model?.brush?.isiO || false;

		this.transport = new Transport(peripheral);
		this.protocol = Protocol.fromByte(peripheral?.advertisement?.manufacturerData?.[2]).name;

		// [device -> brush] commands become methods in brush.set (like brush.set.setColor(...))
		this.set = {};
		for (const command of OUTGOING) {
			this.set[command.name] = (args) => command.run(this, args);
		}

		// [brush -> device] data become getter methods in brush.get to request them (like brush.get.batteryLevel())
		this.get = {};
		for (const command of INCOMING) {
			this.get[command.name] = async () => command.parse(this, await this.transport.read(command.uuid));
		}

		// [brush -> device] subscriptions can be registered as event emitters
		this.on("newListener", (eventName) => {
			if (!this.isConnected) return;

			const command = INCOMING.find((c) => c.name === eventName);
			if (!command || this.#unsubscribers.has(command.name)) return;

			const promise = this.transport.subscribe(command.uuid, (bytes) => {
				try {
					this.emit(eventName, command.parse(this, bytes));
				} catch {}
			});

			this.#unsubscribers.set(command.name, promise);

			promise.catch((err) => {
				this.#unsubscribers.delete(command.name);
				this.emit("error", err);
			});
		});

		// handle removal of [brush -> device] subscriptions
		this.on("removeListener", async (eventName) => {
			if (this.listenerCount(eventName) > 0) return;

			const promise = this.#unsubscribers.get(eventName);
			if (!promise) return;

			this.#unsubscribers.delete(eventName);

			try {
				const unsubscribe = await promise;
				await unsubscribe();
			} catch {}
		});
	}

	get macAddress() {
		return this.peripheral?.address;
	}

	get rssi() {
		return this.peripheral?.rssi;
	}

	get isConnected() {
		return this.peripheral?.state === "connected";
	}

	async connect({ timeout = 10000 } = {}) {
		if (!this.peripheral) throw new Error("Cannot connect to brush: no peripheral found!");

		if (this.isConnected) {
			return this;
		}

		if (this.#connecting) return this.#connecting; // return existing connect to prevent concurrent calls

		this.#connecting = this.#connect({ timeout }).finally(() => {
			this.#connecting = null; // remove connect call once done
		});

		return this.#connecting;
	}

	async #connect({ timeout = 10000 } = {}) {
		try {
			await withTimeout(this.peripheral.connectAsync(), timeout, `Cannot connect to brush: timed out after ${timeout}ms!`);
		} catch (err) {
			this.peripheral.disconnectAsync().catch(() => {}); // disconnect the brush if timed out (don't leave it connecting)
			throw err;
		}

		if (ACCESS_CONTROLLED_PROTOCOLS.includes(Protocol.fromName(this.protocol))) {
			await this.transport.writeSequence([{ uuid: AccessControl.UUID, bytes: AccessControl.UNLOCK_CODE }]);
		}

		this.#unsubscribers.clear(); // clean up unsubscribers just in-case they're stale

		// catch up on listeners registered before we connected or still there after a reconnect
		for (const command of INCOMING) {
			if (this.listenerCount(command.name) > 0) {
				this.emit("newListener", command.name);
			}
		}

		this.emit("connect", this);

		this.peripheral.once("disconnect", () => {
			this.emit("disconnect", this);
			this.#unsubscribers.clear(); // get rid of unsubscribers (we don't actually need to trigger them since the characteristics are gone)
		});

		return this;
	}

	async disconnect() {
		if (!this.peripheral) throw new Error("Cannot disconnect from brush: no peripheral found!");

		if (!this.isConnected) {
			return this;
		}

		await this.peripheral.disconnectAsync(); // will trigger emit in this.peripheral.once('disconnect', ...) above
		return this;
	}
}
