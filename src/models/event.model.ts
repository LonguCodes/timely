import { DateTime } from 'luxon';
import { BaseModel } from '../common/base.model';
import { EventGroup } from '../App';

export class EventModel extends BaseModel<EventModel> {
	get id(): string {
		return (
			this.className +
			this.classType +
			this.groups.map((x) => x.name).join(',')
		);
	}
	className: string;
	groups: EventGroup[];
	classType: string;
	classTitle: string;
	extra: string;
	date: DateTime;
	startTime: DateTime;
	endTime: DateTime;
	classPlace: string;
	maxAttendance: string;
	teacher: string;
	mail: string;
	approvalDate: string;

	protected deserializeProcess(data: { [P in keyof EventModel]: any }): {
		[P in keyof EventModel]: EventModel[P];
	} {
		return {
			...data,
			date: DateTime.fromISO(data.date),
			startTime: DateTime.fromISO(data.startTime),
			endTime: DateTime.fromISO(data.endTime),
		};
	}

	protected serializeProcess<P>(data: {
		[P in keyof EventModel]: EventModel[P];
	}): { [P in keyof EventModel]: any } {
		return {
			...data,
			date: data.date.toISO(),
			startTime: data.startTime.toISO(),
			endTime: data.endTime.toISO(),
		};
	}
}
