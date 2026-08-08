// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\ProtocolVersion.java
// Versions are stored as signed by default.

export class Protocol {
	static UNKNOWN = Object.freeze({
		name: "UNKNOWN",
		version: 0,
	});

	static V001 = Object.freeze({
		name: "V001",
		version: 1,
	});

	static V002 = Object.freeze({
		name: "V002",
		version: 2,
	});

	static V003 = Object.freeze({
		name: "V003",
		version: 3,
	});

	static V004 = Object.freeze({
		name: "V004",
		version: 4,
	});

	static V005 = Object.freeze({
		name: "V005",
		version: 5,
	});

	static V006 = Object.freeze({
		name: "V006",
		version: 6,
	});

	static V007 = Object.freeze({
		name: "V007",
		version: 7,
	});

	static V008 = Object.freeze({
		name: "V008",
		version: 8,
	});

	static V009 = Object.freeze({
		name: "V009",
		version: 9,
	});

	static values = [Protocol.UNKNOWN, Protocol.V001, Protocol.V002, Protocol.V003, Protocol.V004, Protocol.V005, Protocol.V006, Protocol.V007, Protocol.V008, Protocol.V009];

	static fromByte(byte) {
		return Protocol.values.find((protocol) => protocol.version === byte) ?? Protocol.UNKNOWN;
	}

	static fromName(name) {
		return Protocol.values.find((protocol) => protocol.name === name) ?? Protocol.UNKNOWN;
	}
}
