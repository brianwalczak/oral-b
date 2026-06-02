import { BrushModel } from './definitions/brushModel.js';

export class Brush {
	#model;

	constructor(peripheral) {
		this.#model = BrushModel.fromByte(peripheral?.advertisement?.manufacturerData?.[3]);

		this.deviceName = this.#model?.brush?.name || "Unknown";
		this.deviceType = this.#model?.type || null;
		this.isiO = this.#model?.brush?.isiO || false;
		this.macAddress = peripheral?.address;
		this.rssi = peripheral?.rssi;
	}
}