// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\DeviceState.java
// Values are stored as signed by default.

export class DeviceState {
	static UNKNOWN = Object.freeze({
		name: "UNKNOWN",
		value: 0,
	});

	static INIT = Object.freeze({
		name: "INIT",
		value: 1,
	});

	static IDLE = Object.freeze({
		name: "IDLE",
		value: 2,
	});

	static RUN = Object.freeze({
		name: "RUN",
		value: 3,
	});

	static CHARGE = Object.freeze({
		name: "CHARGE",
		value: 4,
	});

	static SETUP = Object.freeze({
		name: "SETUP",
		value: 5,
	});

	static FLIGHT_MENU = Object.freeze({
		name: "FLIGHT_MENU",
		value: 6,
	});

	static CHARGE_FORBIDDEN = Object.freeze({
		name: "CHARGE_FORBIDDEN",
		value: 7,
	});

	static PRE_RUN = Object.freeze({
		name: "PRE_RUN",
		value: 8,
	});

	static PAUSE = Object.freeze({
		name: "PAUSE",
		value: 9,
	});

	static POST_BRUSHING_STATISTICS = Object.freeze({
		name: "POST_BRUSHING_STATISTICS",
		value: 10,
	});

	static FINAL_TEST = Object.freeze({
		name: "FINAL_TEST",
		value: 113,
	});

	static PCB_TEST = Object.freeze({
		name: "PCB_TEST",
		value: 114,
	});

	static SLEEP = Object.freeze({
		name: "SLEEP",
		value: 115,
	});

	static TRANSPORT = Object.freeze({
		name: "TRANSPORT",
		value: 116,
	});

	static CALIBRATION_TEST = Object.freeze({
		name: "CALIBRATION_TEST",
		value: 117,
	});

	static values = [DeviceState.UNKNOWN, DeviceState.INIT, DeviceState.IDLE, DeviceState.RUN, DeviceState.CHARGE, DeviceState.SETUP, DeviceState.FLIGHT_MENU, DeviceState.CHARGE_FORBIDDEN, DeviceState.PRE_RUN, DeviceState.PAUSE, DeviceState.POST_BRUSHING_STATISTICS, DeviceState.FINAL_TEST, DeviceState.PCB_TEST, DeviceState.SLEEP, DeviceState.TRANSPORT, DeviceState.CALIBRATION_TEST];

	static fromByte(byte) {
		return DeviceState.values.find((state) => state.value === byte) ?? DeviceState.UNKNOWN;
	}
}

export class DeviceSubState {
	static UNKNOWN = Object.freeze({
		name: "UNKNOWN",
		value: -1,
	});

	static TRANSPORT_DISABLED_DEACTIVATE_TIMER_DISABLED = Object.freeze({
		name: "TRANSPORT_DISABLED_DEACTIVATE_TIMER_DISABLED",
		value: 0,
	});

	static TRANSPORT_ENABLED_DEACTIVATE_TIMER_DISABLED = Object.freeze({
		name: "TRANSPORT_ENABLED_DEACTIVATE_TIMER_DISABLED",
		value: 1,
	});

	static TRANSPORT_ENABLED_DEACTIVATE_TIMER_ENABLED = Object.freeze({
		name: "TRANSPORT_ENABLED_DEACTIVATE_TIMER_ENABLED",
		value: 3,
	});

	static values = [DeviceSubState.UNKNOWN, DeviceSubState.TRANSPORT_DISABLED_DEACTIVATE_TIMER_DISABLED, DeviceSubState.TRANSPORT_ENABLED_DEACTIVATE_TIMER_DISABLED, DeviceSubState.TRANSPORT_ENABLED_DEACTIVATE_TIMER_ENABLED];

	static fromByte(byte) {
		return DeviceSubState.values.find((subState) => subState.value === byte) ?? DeviceSubState.UNKNOWN;
	}
}
