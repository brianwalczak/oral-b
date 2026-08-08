// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\DeviceState.java
import { DeviceState, DeviceSubState } from "../../definitions/deviceState.js";

export default {
	name: "deviceState",
	uuid: "FF04",

	parse(brush, bytes) {
		if (bytes.length !== 2) return { state: null, subState: null };

		return {
			state: DeviceState.fromByte(bytes.readInt8(0)).name,
			subState: DeviceSubState.fromByte(bytes.readInt8(1)).name,
		};
	},
};
