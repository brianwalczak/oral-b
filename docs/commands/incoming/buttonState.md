# `buttonState`

Which button, if any, is being pressed on the brush.

| Field   | Type     | Description                                                   |
| ------- | -------- | ------------------------------------------------------------- |
| `state` | `string` | One of `NOTHING_PRESSED`, `POWER_PRESSED`, or `MODE_PRESSED`. |

A button release reports as `NOTHING_PRESSED`, so subscribers will see an event for both the press and the release. If both buttons are held at once, `POWER_PRESSED` wins.

#### Code Example:

```js
brush.on("buttonState", ({ state }) => {
	switch (state) {
		case "POWER_PRESSED":
			console.log("Power button has been pressed!");
			break;
		case "MODE_PRESSED":
			console.log("Mode button has been pressed!");
			break;
		case "NOTHING_PRESSED":
			console.log("Button has been lifted!");
			break;
		default:
		// Invalid payload was received, skipping.
	}
});
```

---

[Back to Commands](../../../README.md#commands)
