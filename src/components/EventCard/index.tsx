import styles from './index.sass';
import React from 'react';
import { DateTime } from 'luxon';
import { EventModel } from '../../models/event.model';
import { getGroupColor } from '../../common/colors';
import { dayEnd, dayStart, EventGroup } from '../../App';
import { EventIcon } from '../EventIcon';

interface Props {
	event: EventModel;
	leftOffset?: number;
	groups?: EventGroup[];
}

function getDayPercent(time: DateTime) {
	return (
		(time.diff(dayStart, 'minutes').minutes /
			dayEnd.diff(dayStart, 'minutes').minutes) *
		100
	);
}

export function EventCard({ event, leftOffset = 0 }: Props) {
	const { groups } = event;
	const startPercent = getDayPercent(event.startTime);
	const endPercent = getDayPercent(event.endTime);
	const groupColors = groups.map((group) => ({
		...group,
		color: getGroupColor(group.id),
	}));
	return (
		<div
			className={styles.day__card}
			style={{
				left: leftOffset * 40,
				top: `calc( ${startPercent}% + 5px)`,
				bottom: `calc( ${100 - endPercent}% + 5px)`,
				right: 0,
				zIndex: leftOffset,
			}}
		>
			<div className={styles.title}>
				<span className={styles.title__text}>{event.classTitle}</span>
				<div style={{ flexGrow: 1 }} />

				<EventIcon type={event.classType} />
			</div>
			<div className={styles.group__display__row}>
				{groupColors.map((group) => (
					<div
						className={styles.group__tag}
						key={group.id}
						style={{ background: group.color }}
					>
						{group.name}
					</div>
				))}
				<div style={{ flexGrow: 1 }} />
				<div className={styles.timespan__normal}>
					{event.startTime.toFormat('H:mm')} -{' '}
					{event.endTime.toFormat('H:mm')}
				</div>
			</div>
			<div className={styles.timespan__large}>
				{event.startTime.toFormat('H:mm')} -{' '}
				{event.endTime.toFormat('H:mm')}
			</div>
		</div>
	);
}
