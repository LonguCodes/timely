import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import styles from './App.sass';
import { EventCard } from './components/EventCard';
import { EventModel } from './models/event.model';
import { DiProviderGlobal } from './common/di-provider.global';
import { EventDataRepository } from './repository';
import './common/array-polyfill';
import axios from 'axios';
import { useGetAsync } from './common/useAsyncState';
import { useDelayState } from './common/useDelayState';
import { useTriggerToken } from './common/trigger-token';
import { SearchSelect } from './components/SearchSelect';

export const dayStart = DateTime.fromFormat('6:00', 'H:m');
export const dayEnd = DateTime.fromFormat('24:00', 'H:m');

export interface EventGroup {
	id: number;
	name: string;
}

function isOverlapping(a: EventModel, b: EventModel) {
	if (a.date.weekday !== b.date.weekday) return false;
	return !(a.startTime >= b.endTime || a.endTime <= b.startTime);
}

async function getCurriculaData(name: string | undefined) {
	const result = await axios.get(`http://localhost:3000/${name ?? ''}`);

	console.log(result.data);
	return result.data as { id: string; name: string }[];
}

export function App() {
	const curriculaTriggerToken = useTriggerToken();

	const [rawData, setRawData] = useState<EventModel[]>([]);
	const [data, setData] = useState<Record<string, EventModel[]>>({});
	const [dayRangeStart, setStartDay] = useState(
		DateTime.now().startOf('week')
	);

	// const curricula = useGetAsync(() => getCurriculaData(searchName), {
	// 	token: curriculaTriggerToken,
	// });

	const [groups, setGroups] = useState<EventGroup[]>([]);
	const [chosenGroup, setChosenGroup] = useState(null);

	async function handleFileUpload(event) {
		const file = event.target.files[0];

		const eventDataRepository = DiProviderGlobal.get.getBinding(
			() => EventDataRepository
		);

		const data = await eventDataRepository.loadFromFile(file);
		eventDataRepository.saveToStorage(data);
		loadData(data);
	}

	function loadData(data: EventModel[]) {
		setRawData(data);

		const grouped = data.group(
			(element) => element.date.toISODate() ?? null
		);

		setData(grouped);
		setGroups(
			data.flatMap((event) => event.groups).distinct((group) => group.id)
		);
	}
	function handleChangeGroup(event) {
		const value = event.target.value;
		setChosenGroup(value == 'null' ? null : parseInt(value));
	}

	function handleDayChange(direction: number) {
		const newDate = dayRangeStart.plus({ weeks: direction });
		setStartDay(newDate);
		localStorage.setItem('startday', newDate.toISO());
	}

	useEffect(() => {
		const eventDataRepository = DiProviderGlobal.get.getBinding(
			() => EventDataRepository
		);
		loadData(eventDataRepository.loadFromStorage());

		const loadedStartDay = localStorage.getItem('startday');
		if (loadedStartDay) setStartDay(DateTime.fromISO(loadedStartDay));
	}, []);

	const hourCount = dayEnd.diff(dayStart, 'hours').hours;

	return (
		<div className={styles.root}>
			<div className={styles.top__bar}>
				<SearchSelect
					callback={() => {}}
					items={[
						{
							id: '1',
							display: 'name',
						},
						{
							id: '2',
							display: 'name',
						},
						{
							id: '3',
							display: 'name',
						},
					]}
				/>
				<label className={styles.file__choise}>
					<input
						type="file"
						max={1}
						onChangeCapture={handleFileUpload}
					/>
					Upload timetable
				</label>
				<div className={styles.move__date}>
					<button
						className={styles.move__date__button}
						onClick={() => handleDayChange(-1)}
					>
						-
					</button>

					<div>
						{dayRangeStart.toFormat('DDDD')} -{' '}
						{dayRangeStart.plus({ days: 4 }).toFormat('DDDD')}{' '}
					</div>
					<button
						className={styles.move__date__button}
						onClick={() => handleDayChange(1)}
					>
						+
					</button>
				</div>
				<label>
					Show group :
					<select onChange={handleChangeGroup}>
						<option value="null">All</option>
						{groups.map((x) => (
							<option value={x.id}>{x.name}</option>
						))}
					</select>
				</label>
			</div>

			<div className={styles.week__table}>
				<div className={styles.table__lines}>
					{[...new Array(hourCount).keys()].map((x) => (
						<div className={styles.table__line} />
					))}
				</div>
				<div className={styles.hour__column}>
					{[...new Array(hourCount).keys()].map((x) => (
						<div>{dayStart.plus({ hours: x }).hour}</div>
					))}
				</div>
				{[...new Array(5).keys()].map((x) => {
					const date = dayRangeStart.plus({ days: x }).toISODate();

					const dayData = data[date]?.filter(
						(x) =>
							chosenGroup === null ||
							x.groups.find((group) => group.id === chosenGroup)
					);

					return (
						<div key={date} className={styles.week__column}>
							{dayData?.map((event, i, array) => (
								<EventCard
									leftOffset={
										array
											.slice(0, i)
											.filter((other) =>
												isOverlapping(other, event)
											).length
									}
									key={event.id}
									event={event}
								/>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
}
