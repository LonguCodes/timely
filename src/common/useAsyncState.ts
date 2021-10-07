import { useEffect, useState } from 'react';
import { TriggerToken } from './trigger-token';

export interface GetAsyncOptions<T> {
	dependencies?: any[];
	token?: TriggerToken;
}

export function useGetAsync<T>(
	initialPromise: () => Promise<T>,
	{ dependencies = [], token = null }: GetAsyncOptions<T> = {}
) {
	const [value, setValue] = useState<T>(undefined);
	
	useEffect(() => {
		const callback = () => initialPromise().then(setValue);

		if (token) token.register(callback);
		return () => {
			if (token) token.deregister(callback);
		};
	});

	useEffect(() => {
		initialPromise().then(setValue);
	}, dependencies);

	return value;
}
