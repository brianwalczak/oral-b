export function withTimeout(promise, ms, message) {
	let timer;

	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(new Error(message)), ms);
	});

	return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function toSigned(value) {
	return value >= 128 ? value - 256 : value;
}

export function toUnsigned(byte) {
	return byte < 0 ? byte + 256 : byte;
}

export function toSignedArr(values) {
	return Array.from(values, toSigned);
}
