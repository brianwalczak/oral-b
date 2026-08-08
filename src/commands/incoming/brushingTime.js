// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\BrushingTime.java

export default {
	name: "brushingTime",
	uuid: "FF08",

	parse(brush, bytes) {
		if (bytes.length !== 2) return { minutes: null, seconds: null };

		return {
			minutes: bytes.readUInt8(0),
			seconds: bytes.readUInt8(1),
		};
	},
};
