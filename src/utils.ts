import { Signal, createEffect, createSignal } from "solid-js";

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

function parseJsonWithFallback<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json);
	} catch (e) {
		console.error(e);
		return fallback;
	}
}

export function createLocalStorageSignal<T>(key: string, defaultValue: T): Signal<T> {
	const initialValueJson = localStorage.getItem(key);

	let initialValue: T;

	if (initialValueJson) {
		initialValue = parseJsonWithFallback(initialValueJson, defaultValue);
	} else {
		initialValue = defaultValue;
	}

	const [value, setValue] = createSignal(initialValue);

	createEffect(() => {
		localStorage.setItem(key, JSON.stringify(value()));
	});

	return [value, setValue];
}
