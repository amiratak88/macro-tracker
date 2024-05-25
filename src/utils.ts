export function omit<K extends string | number | symbol, R extends Record<K, unknown>>(
	obj: R,
	...keys: K[]
): Omit<R, K> {
	const copy = { ...obj };
	for (const key of keys) {
		delete copy[key];
	}

	return copy;
}
