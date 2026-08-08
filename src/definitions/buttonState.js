// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\ButtonState.java
// The Java enum carries byte values, but they're unused so only the names have been kept.

export class ButtonState {
	static UNKNOWN = "UNKNOWN";
	static NOTHING_PRESSED = "NOTHING_PRESSED";
	static POWER_PRESSED = "POWER_PRESSED";
	static MODE_PRESSED = "MODE_PRESSED";

	static values = [ButtonState.UNKNOWN, ButtonState.NOTHING_PRESSED, ButtonState.POWER_PRESSED, ButtonState.MODE_PRESSED];
}
