# `brushingTime`

How long the current brushing session has been running.

| Field     | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `minutes` | `number` | Elapsed minutes of the session.    |
| `seconds` | `number` | Elapsed seconds within the minute. |

This counter starts at zero and resets between brush sessions.

#### Code Example:

```js
// Subscribe to receive brushing time updates.
brush.on("brushingTime", ({ minutes, seconds }) => {
	console.log(`Brushing for ${minutes}m ${seconds}s.`);
});
```

---

[Back to Commands](../../../README.md#commands)
