// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\ButtonState.java
import { ButtonState } from "../../definitions/buttonState.js";

export default {
	name: "buttonState",
	uuid: "FF06",

	parse(brush, bytes) {
		if (bytes.length < 2) return { state: null };

		// Each byte is a flag (power takes priority over mode).
		if (bytes.readUInt8(0) === 1) return { state: ButtonState.POWER_PRESSED };

		return { state: bytes.readUInt8(1) === 1 ? ButtonState.MODE_PRESSED : ButtonState.NOTHING_PRESSED };
	},
};
