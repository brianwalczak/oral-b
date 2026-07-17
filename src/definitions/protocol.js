// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\ProtocolVersion.java
export class Protocol {
    static UNKNOWN = Object.freeze({
        name: "UNKNOWN",
        value: 0
    });

    static V001 = Object.freeze({
        name: "V001",
        value: 1
    });

    static V002 = Object.freeze({
        name: "V002",
        value: 2
    });

    static V003 = Object.freeze({
        name: "V003",
        value: 3
    });

    static V004 = Object.freeze({
        name: "V004",
        value: 4
    });

    static V005 = Object.freeze({
        name: "V005",
        value: 5
    });

    static V006 = Object.freeze({
        name: "V006",
        value: 6
    });

    static V007 = Object.freeze({
        name: "V007",
        value: 7
    });

    static V008 = Object.freeze({
        name: "V008",
        value: 8
    });

    static V009 = Object.freeze({
        name: "V009",
        value: 9
    });

    static values = [
        Protocol.UNKNOWN,
        Protocol.V001,
        Protocol.V002,
        Protocol.V003,
        Protocol.V004,
        Protocol.V005,
        Protocol.V006,
        Protocol.V007,
        Protocol.V008,
        Protocol.V009
    ];

    static fromByte(byte) {
        return Protocol.values.find(protocol => protocol.value === byte) ?? Protocol.UNKNOWN;
    }
}
