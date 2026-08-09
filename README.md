# oral-b

A Node.js library for bidirectional Bluetooth communication with Oral-B smart toothbrushes.

Communicate with your brush directly within Node.js. Discover and connect to brushes, read brushing data, and more.

> [!WARNING]
> This is an unofficial library built by reverse-engineering the Oral-B Android app functionality. It is not affiliated with, endorsed by, or supported by Procter & Gamble.

## Installation

```bash
npm install oral-b @stoprocent/noble
```

[`@stoprocent/noble`](https://github.com/stoprocent/noble) is not bundled in this library, allowing you to choose a Noble implementation that best fits your use-case.

It is recommended that you use this particular Noble fork, however, alternative forks _should_ be compatible.

## Quick Start

To get started with `oral-b` quickly, you can use the following example program:

```js
import noble from "@stoprocent/noble";
import { OralBClient } from "oral-b";

const client = new OralBClient(noble);

// Discover brushes nearby.
const brushes = await client.discover({ timeout: 5000 });
if (brushes.length === 0) throw new Error("No brushes found!");

// Connect to the first available brush.
const brush = brushes[0];
await brush.connect();

// Read a value once.
console.log(await brush.get.brushingTime()); // { minutes: 1, seconds: 26 }

// Or subscribe, and let the brush push updates.
brush.on("brushingTime", ({ minutes, seconds }) => {
	console.log(`Brushing for ${minutes}m ${seconds}s.`);
});

// Disconnect from the brush.
await brush.disconnect();
```

Please refer to the API documentation below for a list of [available commands](#commands).

## API Documentation

### OralBClient

```js
const client = new OralBClient(noble);
```

#### Methods

| Method                          | Description                                                        | Returns                              |
| ------------------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| `discover({ timeout = 10000 })` | Scans for nearby brushes. Waits for the adapter to power on first. | `Promise<Brush[]>`                   |
| `stopDiscover()`                | Ends an in-flight `discover()` early.                              | `void`                               |
| `getConnectedBrushes()`         | Currently connected brushes.                                       | `Brush[]`                            |
| `getBrush(macAddress)`          | Get a connected brush by its MAC address.                          | `Brush \| undefined`                 |
| `disconnectAll()`               | Disconnects every connected brush.                                 | `Promise<void>`                      |
| `connect(brush, options)`       | Wrapper for `brush.connect(options)`.                              | matches [`Brush#connect`](#brush)    |
| `disconnect(brush)`             | Wrapper for `brush.disconnect()`.                                  | matches [`Brush#disconnect`](#brush) |

#### Events

| Event         | Description                                                | Payload   |
| ------------- | ---------------------------------------------------------- | --------- |
| `discover`    | A new brush is seen during a scan.                         | `Brush`   |
| `discoverEnd` | A scan finishes (via timeout or `stopDiscover()`).         | `Brush[]` |
| `connect`     | A brush connects. Same as `Brush`'s `connect` event.       | `Brush`   |
| `disconnect`  | A brush disconnects. Same as `Brush`'s `disconnect` event. | `Brush`   |

### Brush

A `Brush` represents a single physical toothbrush. Instances come from [`OralBClient#discover`](#oralbclient) rather than constructing them directly.

#### Properties

| Property      | Type             | Description                                                                                             |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `deviceName`  | `string`         | The brush model name, such as `"iO Series"`. `"Unknown"` if unrecognized.                               |
| `deviceType`  | `string \| null` | The variant within the brush model, such as `"6 Mode"`.                                                 |
| `isiO`        | `boolean`        | Whether this brush is an Oral-B iO series model.                                                        |
| `protocol`    | `string`         | Firmware protocol version, such as `"V006"`. Determines how some characteristics are decoded.           |
| `macAddress`  | `string`         | The brush's Bluetooth MAC address.                                                                      |
| `rssi`        | `number`         | Signal strength of the brush.                                                                           |
| `isConnected` | `boolean`        | Whether the brush is currently connected.                                                               |
| `get`         | `object`         | Methods for reading data from the brush (returns a `Promise` of the result). See [Commands](#commands). |
| `set`         | `object`         | Methods for sending data to the brush. See [Commands](#commands).                                       |
| `peripheral`  | `Peripheral`     | The underlying Noble peripheral instance used internally.                                               |
| `transport`   | `Transport`      | The characteristic layer used internally for reads, writes, and subscriptions.                          |

#### Methods

| Method                         | Description                                                               | Returns          |
| ------------------------------ | ------------------------------------------------------------------------- | ---------------- |
| `connect({ timeout = 10000 })` | Connects to the brush. Resolves immediately if already connected.         | `Promise<Brush>` |
| `disconnect()`                 | Disconnects from the brush. Resolves immediately if already disconnected. | `Promise<Brush>` |

#### Events

| Event          | Description                                                          | Payload  |
| -------------- | -------------------------------------------------------------------- | -------- |
| `connect`      | The brush has connected.                                             | `Brush`  |
| `disconnect`   | The brush has disconnected.                                          | `Brush`  |
| `error`        | Emitted if setting up a subscription for a command fails.            | `Error`  |
| (command name) | The brush pushes an update for a command. See [Commands](#commands). | `object` |

### Commands

Commands come in two directions:

- **[Incoming](#incoming)** (brush to device) are exposed in 2 ways: as `brush.get.<command>()` for a one-time read, and as an event for the brush to push updates. Both return the same parsed object.
- **[Outgoing](#outgoing)** (device to brush) are exposed as `brush.set.<command>(args)`. Used to send data (such as a configuration) to the brush.

```js
// Read a value once.
const { minutes, seconds } = await brush.get.brushingTime();

// Or subscribe, and let the brush push updates.
brush.on("brushingTime", ({ minutes, seconds }) => {
	console.log(`Brushing for ${minutes}m ${seconds}s.`);
});
```

Support for individual commands (as well as certain values) varies by the firmware protocol version the brush model uses, which is noted on each command's page.

#### Incoming

| Command                                                  | Description                                             |
| -------------------------------------------------------- | ------------------------------------------------------- |
| [`batteryLevel`](docs/commands/incoming/batteryLevel.md) | The brush's battery charge.                             |
| [`brushingTime`](docs/commands/incoming/brushingTime.md) | How long the current brushing session has been running. |
| [`buttonState`](docs/commands/incoming/buttonState.md)   | Which button, if any, is being pressed on the brush.    |
| [`deviceState`](docs/commands/incoming/deviceState.md)   | What the brush is currently doing.                      |

#### Outgoing

No outgoing commands have been implemented yet, so `brush.set` is currently empty.

Support is currently on the roadmap, so check back soon for updates!
