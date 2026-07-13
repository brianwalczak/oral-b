import { EventEmitter } from 'node:events';
import { BrushModel } from './definitions/brushModel.js';
import { withTimeout } from './utils/helpers.js';

export class Brush extends EventEmitter {
	#model;

	constructor(peripheral) {
		super();

		this.peripheral = peripheral;
		this.#model = BrushModel.fromByte(peripheral?.advertisement?.manufacturerData?.[3]);

		this.deviceName = this.#model?.brush?.name || "Unknown";
		this.deviceType = this.#model?.type || null;
		this.isiO = this.#model?.brush?.isiO || false;
	}

	get macAddress() {
		return this.peripheral?.address;
	}
	
	get rssi() {
		return this.peripheral?.rssi;
	}

	get isConnected() {
		return this.peripheral?.state === 'connected';
	}

	async connect({ timeout = 10000 } = {}) {
		if (!this.peripheral) throw new Error('Cannot connect to brush: no peripheral found!');

		if (this.isConnected) {
			return this;
		}

		await withTimeout(this.peripheral.connectAsync(), timeout, `Cannot connect to brush: timed out after ${timeout}ms!`);

		this.emit('connect', this);

		this.peripheral.once('disconnect', () => {
			this.emit('disconnect', this);
		});

		return this;
	}

	async disconnect() {
		if (!this.peripheral) throw new Error('Cannot disconnect from brush: no peripheral found!');
		
		if (!this.isConnected) {
			return this;
		}

		await this.peripheral.disconnectAsync(); // will trigger emit in this.peripheral.once('disconnect', ...) above
		return this;
	}
}