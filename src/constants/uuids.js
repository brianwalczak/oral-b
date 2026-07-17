// src\main\java\codes\alchemy\oralb\blesdk\data\characteristic\model\Characteristic.java
const BASE_URL_STRING = 'A0F0XXXX-5047-4D53-8208-4F72616C2D42';

export function full(shortUuid) {
	const fullUuid = BASE_URL_STRING.replace('XXXX', shortUuid);

	return fullUuid.replaceAll('-', '').toLowerCase(); // Format for Noble compatibility (lowercase, no dashes).
}
