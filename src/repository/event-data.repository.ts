import Papa from 'papaparse';
import { BindingLifetime, injectable } from 'injectable-js';
import { EventModel } from '../models/event.model';
import { DateTime } from 'luxon';

@injectable(BindingLifetime.Singleton)
export class EventDataRepository {
	public loadFromStorage(): EventModel[] {
		const loadedData = localStorage.getItem('event_model_data');
		if (loadedData)
			return JSON.parse(loadedData).map((x) =>
				new EventModel().deserialize(x)
			);
		return [];
	}

	public saveToStorage(data: EventModel[]) {
		const serialized = JSON.stringify(data.map((x) => x.serialize()));
		localStorage.setItem('event_model_data', serialized);
	}

	public async loadFromFile(file: Blob): Promise<EventModel[]> {
		const fileReader = new FileReader();
		const contentPromise = new Promise(
			(resolve) =>
				(fileReader.onloadend = () => resolve(fileReader.result))
		);
		fileReader.readAsText(file);
		const content = await contentPromise;
		let { data } = Papa.parse(content) as { data: any[] };
		data = data.slice(1, -1);

		const processedData = data.map(
			([
				className,
				classGroup,
				classType,
				classTitle,
				extra,
				date,
				startTime,
				endTime,
				classPlace,
				maxAttendance,
				teacher,
				mail,
				approvalDate,
			]) => ({
				classId: classTitle + classType + classGroup,
				classGroup,
				classType,
				classTitle: classTitle.replace(/\(.*\)|\[.*]/g,''),
				classPlace,
				extra,
				date: date
					? DateTime.fromFormat(date, 'd.LL.yyyy').toISO()
					: null,
				startTime: DateTime.fromFormat(startTime, 'H:m').toISO(),
				endTime: DateTime.fromFormat(endTime, 'H:m').toISO(),
				maxAttendance,
				teacher,
				mail,
				approvalDate,
				className: className.replace(/\(.*\)|\[.*]/g,''),
			})
		);

		const groups = [...new Set(processedData.map((x) => x.classGroup))]
			.sort()
			.map((x, i) => ({
				name: x,
				id: i,
			}));

		const groupedClasses = new Set(
			processedData
				.filter((value, i, array) =>
					array.find(
						(y) =>
							y.classTitle === value.classTitle &&
							y.classType === value.classType &&
							value.classGroup !== y.classGroup
					)
				)
				.map((x) => x.classId)
		);

		const dataWithGroups = processedData.map((event) => ({
			...event,
			classId: null,
			classGroup: undefined,
			groups: groupedClasses.has(event.classId)
				? [groups.find((x) => x.name === event.classGroup)]
				: groups,
		}));

		console.log(dataWithGroups);

		return dataWithGroups.map((value) =>
			new EventModel().deserialize(value)
		);
	}
}
