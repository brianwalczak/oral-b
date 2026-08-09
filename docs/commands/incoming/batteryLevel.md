# `batteryLevel`

The brush's battery charge.

| Field         | Type     | Description                                  |
| ------------- | -------- | -------------------------------------------- |
| `level`       | `number` | Remaining charge, as a percentage (0 - 100). |
| `secondsLeft` | `number` | Seconds remaining, as reported by the brush. |

`secondsLeft` requires protocol `V003` or newer, as older versions don't return the field at all.

## Battery diagnostics

Brushes on protocol `V007` and newer report extra battery-management details alongside the fields above. Any field the brush leaves out is `null`, so check before using them.

| Field                                                 | Type     |
| ----------------------------------------------------- | -------- |
| `voltageMilliVolts`                                   | `number` |
| `currentMilliAmperes`                                 | `number` |
| `temperatureCelsius`                                  | `number` |
| `availableSocPercent`                                 | `number` |
| `dischargeCapacityMilliAmpereSeconds`                 | `number` |
| `currentConditionRemainingCapacityMilliAmpereSeconds` | `number` |
| `socHandlerState`                                     | `number` |

#### Code Example:

```js
// Get the battery level.
const { level } = await brush.get.batteryLevel();
console.log(`Brush battery is currently ${level}%.`);
```

---

[Back to Commands](../../../README.md#commands)
