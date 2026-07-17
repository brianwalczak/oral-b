// src\main\java\codes\alchemy\oralb\blesdk\devices\model\Brush.java
// Values are stored as unsigned, while bytes are represented as signed.
import { toUnsigned } from "../utils/helpers.js";

export class BrushModel {
	static UNKNOWN = Object.freeze({
		name: "Unknown",
		isiO: false,
		values: [153],
	});

	static EXPERIMENTAL = Object.freeze({
		name: "Experimental",
		isiO: false,
		values: [255],
	});

	static D36 = Object.freeze({
		name: "D36",
		isiO: false,
		values: [63, 0, 1, 2],
		types: ["Experimental", "X Mode", "6 Mode", "5 Mode"],
	});

	static D21 = Object.freeze({
		name: "D21",
		isiO: false,
		values: [127, 64, 65, 66, 69, 67, 68, 70],
		types: ["Experimental", "X Mode", "4 Mode", "3A Mode", "3B Mode", "2A Mode", "2B Mode", "1 Mode"],
	});

	static D706 = Object.freeze({
		name: "Genius X",
		isiO: false,
		values: [112, 113, 114],
		types: ["X Mode", "6 Mode", "5 Mode"],
	});

	static D701 = Object.freeze({
		name: "D701",
		isiO: false,
		values: [32, 33, 34],
		types: ["X Mode", "6 Mode", "5 Mode"],
	});

	static D700 = Object.freeze({
		name: "D700",
		isiO: false,
		values: [39, 40, 41],
		types: ["5 Mode", "4 Mode", "6 Mode"],
	});

	static D601 = Object.freeze({
		name: "D601",
		isiO: false,
		values: [80, 81, 82, 83, 84, 85, 86, 87],
		types: ["X Mode", "5 Mode", "4 Mode", "3A Mode", "2A Mode", "2B Mode", "3B Mode", "1 Mode"],
	});

	static iO = Object.freeze({
		name: "iO Series",
		isiO: true,
		values: [48, 49, 50, 54],
		types: ["X Mode", "Regular", "BIG TI", "EPLATFORM"],
	});

	static iO4 = Object.freeze({
		name: "iO Series 4",
		isiO: true,
		values: [52],
	});

	static iO5 = Object.freeze({
		name: "iO Series 5",
		isiO: true,
		values: [53],
	});

	static values = [BrushModel.UNKNOWN, BrushModel.EXPERIMENTAL, BrushModel.D36, BrushModel.D21, BrushModel.D706, BrushModel.D701, BrushModel.D700, BrushModel.D601, BrushModel.iO, BrushModel.iO4, BrushModel.iO5];

	static fromValue(value) {
		const brush = BrushModel.values.find((brush) => brush.values.includes(value)) ?? null;
		const type = brush && brush.types ? brush.types[brush.values.indexOf(value)] : null;

		return { brush, ...(type && { type }) };
	}

	static fromByte(byte) {
		return BrushModel.fromValue(toUnsigned(byte));
	}
}
