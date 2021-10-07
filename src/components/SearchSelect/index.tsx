import React from 'react';
import styles from './index.sass';
import { useDelayState } from '../../common/useDelayState';

export interface SearchSelectItem {
	id: string;
	display: any;
}

export interface SearchSelectParams<T extends SearchSelectItem> {
	callback: (value: T) => void;
	items: T[];
}

export function SearchSelect<T extends SearchSelectItem>({
	callback,
	items = [],
}: SearchSelectParams<T>) {
	const [searchName, setSearchName] = useDelayState<T>(undefined, {
		callback: () => callback(searchName),
	});

	return (
		<div className={styles.root}>
			<input className={styles.text__field} />
			<div className={styles.choise__options}>
				{items.map(({ id, display }) => {
					return (
						<div key={id} className={styles.option}>
							{display}
						</div>
					);
				})}
			</div>
		</div>
	);
}
