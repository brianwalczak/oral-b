// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\BatteryLevel.java
import { Protocol } from "../../definitions/protocol.js";

export default {
	name: "batteryLevel",
	uuid: "FF05",

	parse(brush, bytes) {
		const protocol = brush?.protocol ?? Protocol.UNKNOWN;

		switch (protocol) {
			case Protocol.UNKNOWN:
			case Protocol.V001:
			case Protocol.V002: {
				if (bytes.length !== 1) return { level: null };

				return { level: bytes.readUInt8(0) };
			}
			case Protocol.V003:
			case Protocol.V004:
			case Protocol.V005:
			case Protocol.V006: {
				if (bytes.length !== 4) return { level: null, secondsLeft: null };

				return {
					level: bytes.readInt8(0) & 127,
					secondsLeft: bytes.readUInt16BE(1),
				};
			}
			case Protocol.V007:
			case Protocol.V008:
			case Protocol.V009: {
				if (bytes.length < 3) return { level: null, secondsLeft: null, voltageMilliVolts: null, currentMilliAmperes: null, temperatureCelsius: null, availableSocPercent: null, dischargeCapacityMilliAmpereSeconds: null, currentConditionRemainingCapacityMilliAmpereSeconds: null, socHandlerState: null };

				return {
					level: bytes.readInt8(0) & 127,
					secondsLeft: bytes.readUInt16LE(1),
					voltageMilliVolts: bytes.length >= 5 ? bytes.readUInt16LE(3) : null,
					currentMilliAmperes: bytes.length >= 7 ? bytes.readInt16LE(5) : null,
					temperatureCelsius: bytes.length >= 8 ? bytes.readInt8(7) : null,
					availableSocPercent: bytes.length >= 9 ? bytes.readUInt8(8) : null,
					dischargeCapacityMilliAmpereSeconds: bytes.length >= 13 ? bytes.readUInt32LE(9) : null,
					currentConditionRemainingCapacityMilliAmpereSeconds: bytes.length >= 17 ? bytes.readUInt32LE(13) : null,
					socHandlerState: bytes.length >= 18 ? bytes.readUInt8(17) : null,
				};
			}
			default: {
				return {};
			}
		}
	},
};
