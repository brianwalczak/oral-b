import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function load(folder) {
	const files = fs.readdirSync(path.join(__dirname, folder)).filter((file) => file.endsWith(".js"));
	const modules = await Promise.all(files.map((file) => import(`./${folder}/${file}`)));

	return modules.map((module) => module.default);
}

export const OUTGOING = await load("outgoing");
export const INCOMING = await load("incoming");
