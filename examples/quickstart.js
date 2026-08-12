import noble from "@stoprocent/noble";
import { OralBClient } from "oral-b";

const client = new OralBClient(noble);
const timeout = 5000; // ms

async function main() {
	console.log(`Scanning for brushes (${timeout / 1000}s timeout)...`);
	const brushes = await client.discover({ timeout });

	if (brushes.length === 0) {
		console.log("No brushes found!");
		return;
	}

	console.log(`Found ${brushes.length} brush${brushes.length !== 1 ? "es" : ""}:`);
	for (const brush of brushes) {
		console.log(` - ${brush.deviceName} (RSSI: ${brush.rssi})`);
	}

	const brush = brushes[0];
	console.log(`\nConnecting to ${brush.deviceName}...`);
	await brush.connect();
	console.log("Connected!");

	const battery = await brush.get.batteryLevel();
	console.log(`Your brush's battery level is currently ${battery.level}%. ${battery.secondsLeft && battery.secondsLeft != 0 ? 'Your brush estimates ' + battery.secondsLeft + ' seconds left!' : ''}\n`);

	brush.on("deviceState", ({ state }) => {
		switch (state) {
			case 'INIT':
				console.log('Your brush is currently initializing...');
				break;
			case 'IDLE':
				console.log('Your brush is currently idle.');
				break;
			case 'RUN':
				console.log('Your brush is currently running a brush session!');
				break;
			case 'CHARGE':
				console.log('Your brush is currently charging.');
				break;
			case 'PAUSE':
				console.log('Your brush is currently paused.');
				break;
			case 'SLEEP':
				console.log('Your brush is currently sleeping.');
				break;
			default:
				return;
		}
	});

	brush.on("buttonState", ({ state }) => {
		switch (state) {
			case 'POWER_PRESSED':
				console.log('You have pushed the power button.');
				break;
			case 'MODE_PRESSED':
				console.log('You have pushed the mode switch button.');
				break;
			default:
				return;
		}
	});

	brush.on("brushingTime", ({ minutes, seconds }) => {
		if (minutes === 0 && seconds === 0) return;

		console.log(`Brushing Time: ${minutes} minutes, ${seconds} seconds.`);
	});
	
	await new Promise((resolve) => setTimeout(resolve, 20000)); // 20 seconds

	console.log("\nDisconnecting...");
	await brush.disconnect();
	console.log("Disconnected.");
}

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit(0));
