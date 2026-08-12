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
}

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit(0));
