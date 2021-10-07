import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { v4 } from 'uuid';

export interface DelayStateOptions<T> {
	delay?: number;
	callback?: (value: SetStateAction<T>) => void;
}

class DelayCallbackManager {
	private static _instance: DelayCallbackManager;
	public static get instance(): DelayCallbackManager {
		if (!this._instance) this._instance = new DelayCallbackManager();
		return this._instance;
	}

	public registry: Record<string, { id: string; value: any }> = {};
}

export function useDelayCallback<T>(
	callback: (value: T) => void,
	delay: number = 1000
) {
	const [delayId] = useState<string>(v4());
	function setValue(value: T) {
		const id = v4();
		DelayCallbackManager.instance.registry[delayId] = { id, value };
	}
	useEffect(() => {
		if (!DelayCallbackManager.instance.registry[delayId]) return;
		const currentId =
			DelayCallbackManager.instance.registry[delayId].id.toString();
		setTimeout(() => {
			const delay = DelayCallbackManager.instance.registry[delayId];
			if (delay.id === currentId) callback(delay.value);
		}, delay);
	}, [DelayCallbackManager.instance.registry[delayId]]);

	return setValue;
}

export function useDelayState<T>(
	initialValue?: T | (() => T),
	{ callback = () => {}, delay = 1000 }: DelayStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>] {
	const [value, setValueInternal] = useState<T>(initialValue);

	const callCallback = useDelayCallback<SetStateAction<T>>(callback, delay);
	function setValue(value: SetStateAction<T>) {
		setValueInternal(value);
		callCallback(value);
		console.log('test');
	}
	return [value, setValue];
}
