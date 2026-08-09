# `deviceState`

What the brush is currently doing.

| Field      | Type     | Description                                                                                                                                                                                                        |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `state`    | `string` | One of `UNKNOWN`, `INIT`, `IDLE`, `RUN`, `CHARGE`, `SETUP`, `FLIGHT_MENU`, `CHARGE_FORBIDDEN`, `PRE_RUN`, `PAUSE`, `POST_BRUSHING_STATISTICS`, `FINAL_TEST`, `PCB_TEST`, `SLEEP`, `TRANSPORT`, `CALIBRATION_TEST`. |
| `subState` | `string` | One of `UNKNOWN`, `TRANSPORT_DISABLED_DEACTIVATE_TIMER_DISABLED`, `TRANSPORT_ENABLED_DEACTIVATE_TIMER_DISABLED`, `TRANSPORT_ENABLED_DEACTIVATE_TIMER_ENABLED`.                                                     |

Either field reports `UNKNOWN` if the brush sends a value this library doesn't recognize.

#### Code Example:

```js
// Get the current device state.
const { state, subState } = await brush.get.deviceState();
console.log(`The brush is currently ${state}.`);

// Subscribe to receive automatic updates.
brush.on("deviceState", ({ state }) => {
	if (state === "RUN") console.log("Brushing has started!");
});
```

---

[Back to Commands](../../../README.md#commands)
