"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Tooltip, Modal, ListGroup } from "react-bootstrap";
import NothingFoundAlert from "@/layout/nothingfoundalert";

const CELL_SIZE = 13;
const CELL_GAP = 3;
const COLUMN_STEP = CELL_SIZE + CELL_GAP;
const WEEKDAY_GUTTER = 34;
const DEFAULT_WEEKS = 53;
const DEFAULT_PALETTE = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const WEEKDAY_ROW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const startOfDay = (value) => {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date;
};

const addDays = (value, amount) => {
	const date = new Date(value);
	date.setDate(date.getDate() + amount);
	return date;
};

const toDateKey = (date) =>
	`${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;

const formatLongDate = (date) =>
	date.toLocaleDateString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

const buildLevelResolver = (maxCount, thresholds) => {
	if (Array.isArray(thresholds) && thresholds.length === 4) {
		return (count) => {
			if (count <= 0) return 0;
			for (let index = thresholds.length - 1; index >= 0; index--) {
				if (count >= thresholds[index]) return index + 1;
			}
			return 1;
		};
	}

	const bucket = Math.max(maxCount, 4) / 4;
	return (count) => (count <= 0 ? 0 : Math.min(4, Math.ceil(count / bucket)));
};

const buildMonthLabels = (weeks) => {
	const labels = [];
	let previousMonth = null;
	let previousLabelColumn = Number.NEGATIVE_INFINITY;
	let previousLabelWidth = 0;
	let previousLabelYear = null;

	weeks.forEach((week, columnIndex) => {
		const firstDayOfColumn = week[0].date;
		const month = firstDayOfColumn.getMonth();
		const year = firstDayOfColumn.getFullYear();

		if (month === previousMonth) return;
		previousMonth = month;

		if (columnIndex === 0 && firstDayOfColumn.getDate() > 7) return;
		if (columnIndex > weeks.length - 3) return;

		const text =
			year === previousLabelYear
				? MONTH_NAMES[month]
				: `${MONTH_NAMES[month]} ${year}`;
		const width = text.length * 6.5;

		const columnsNeeded = Math.ceil((previousLabelWidth + 6) / COLUMN_STEP);
		if (columnIndex - previousLabelColumn < Math.max(columnsNeeded, 3)) return;

		labels.push({ columnIndex, text });
		previousLabelColumn = columnIndex;
		previousLabelWidth = width;
		previousLabelYear = year;
	});

	return labels;
};

const Timeline = ({ activities = [] }) => {
	const months = useMemo(() => {
		const grouped = new Map();

		activities.forEach((activity) => {
			const date = new Date(activity.createdAt);
			if (Number.isNaN(date.getTime())) return;

			const sortKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
			if (!grouped.has(sortKey)) {
				grouped.set(sortKey, {
					sortKey,
					label: date.toLocaleString(undefined, {
						month: "long",
						year: "numeric",
					}),
					items: [],
				});
			}
			grouped.get(sortKey).items.push(activity);
		});

		return [...grouped.values()]
			.sort((a, b) => b.sortKey.localeCompare(a.sortKey))
			.map((month) => {
				const byType = new Map();
				const items = [...month.items].sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
				);

				items.forEach((activity) => {
					const type = activity.type || activity.onModel || "Activity";
					if (!byType.has(type)) byType.set(type, []);
					byType.get(type).push(activity);
				});

				return { ...month, items, groups: [...byType.entries()] };
			});
	}, [activities]);

	if (months.length === 0) return null;

	return (
		<div className="timeline mt-4">
			{months.map((month) => (
				<div key={month.sortKey} className="mb-3">
					<h5>
						{month.label} ({month.items.length})
					</h5>
					{month.groups.map(([type, group]) => (
						<div key={type} className="mb-2">
							<strong>
								{type} ({group.length}):
							</strong>
							<ListGroup className="mt-1">
								{group.map((activity, index) => (
									<ListGroup.Item key={activity._id || `${type}-${index}`}>
										{new Date(activity.createdAt).toLocaleDateString()}:{" "}
										{activity.text}
									</ListGroup.Item>
								))}
							</ListGroup>
						</div>
					))}
				</div>
			))}
		</div>
	);
};

const ActivityChart = ({
	data = [],
	weeks: weeksToShow = DEFAULT_WEEKS,
	palette = DEFAULT_PALETTE,
	thresholds = null,
	showTimeline = true,
}) => {
	const [selectedDay, setSelectedDay] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const scrollerRef = useRef(null);

	const activities = useMemo(() => (Array.isArray(data) ? data : []), [data]);

	const activityByDate = useMemo(() => {
		const buckets = {};
		activities.forEach((activity) => {
			const date = new Date(activity.createdAt);
			if (Number.isNaN(date.getTime())) return;

			const key = toDateKey(date);
			if (!buckets[key]) buckets[key] = [];
			buckets[key].push(activity);
		});
		return buckets;
	}, [activities]);

	const { weeks, monthLabels, totalInWindow, maxCount } = useMemo(() => {
		const today = startOfDay(new Date());
		const lastColumnEnds = addDays(today, 6 - today.getDay());
		const firstCell = addDays(lastColumnEnds, -(weeksToShow * 7 - 1));

		const grid = [];
		let total = 0;
		let max = 0;

		for (let column = 0; column < weeksToShow; column++) {
			const week = [];
			for (let row = 0; row < 7; row++) {
				const date = addDays(firstCell, column * 7 + row);
				const key = toDateKey(date);
				const count = activityByDate[key]?.length || 0;

				total += count;
				if (count > max) max = count;

				week.push({ date, key, count, isFuture: date > today });
			}
			grid.push(week);
		}

		return {
			weeks: grid,
			monthLabels: buildMonthLabels(grid),
			totalInWindow: total,
			maxCount: max,
		};
	}, [activityByDate, weeksToShow]);

	const getLevel = useMemo(
		() => buildLevelResolver(maxCount, thresholds),
		[maxCount, thresholds],
	);

	useEffect(() => {
		const scroller = scrollerRef.current;
		if (scroller) scroller.scrollLeft = scroller.scrollWidth;
	}, [weeksToShow]);

	const openDay = (day) => {
		setSelectedDay({
			key: day.key,
			label: formatLongDate(day.date),
			activities: activityByDate[day.key] || [],
		});
		setShowModal(true);
	};

	const gridWidth = weeksToShow * COLUMN_STEP;

	return (
		<>
			<div className="w-100">
				<div className="d-flex flex-wrap align-items-baseline justify-content-between mb-2">
					<span style={{ fontSize: "0.9rem", color: "#24292f" }}>
						{totalInWindow.toLocaleString()}{" "}
						{totalInWindow === 1 ? "activity" : "activities"} in the last year
					</span>
					<span style={{ fontSize: "0.75rem", color: "#6c757d" }}>
						Busiest day: {maxCount.toLocaleString()}
					</span>
				</div>

				<div ref={scrollerRef} className="overflow-x-auto pb-1">
					<div style={{ width: WEEKDAY_GUTTER + gridWidth }}>
						<div style={{ marginLeft: WEEKDAY_GUTTER }}>
							<div
								style={{
									position: "relative",
									height: 16,
									width: gridWidth,
								}}
							>
								{monthLabels.map((label) => (
									<span
										key={label.columnIndex}
										style={{
											position: "absolute",
											left: label.columnIndex * COLUMN_STEP,
											top: 0,
											fontSize: "0.7rem",
											lineHeight: "16px",
											whiteSpace: "nowrap",
											color: "#57606a",
										}}
									>
										{label.text}
									</span>
								))}
							</div>
						</div>

						<div className="d-flex">
							<div
								className="d-flex flex-column"
								style={{ width: WEEKDAY_GUTTER }}
								aria-hidden="true"
							>
								{WEEKDAY_ROW_LABELS.map((label, row) => (
									<div
										key={row}
										style={{
											height: CELL_SIZE,
											marginBottom: CELL_GAP,
											fontSize: "0.7rem",
											lineHeight: `${CELL_SIZE}px`,
											color: "#57606a",
										}}
									>
										{label}
									</div>
								))}
							</div>

							<div className="d-flex" role="grid" aria-label="Activity chart">
								{weeks.map((week) => (
									<div
										key={week[0].key}
										className="d-flex flex-column"
										style={{ marginRight: CELL_GAP }}
										role="row"
									>
										{week.map((day) => {
											if (day.isFuture) {
												return (
													<div
														key={day.key}
														role="gridcell"
														aria-hidden="true"
														style={{
															width: CELL_SIZE,
															height: CELL_SIZE,
															marginBottom: CELL_GAP,
														}}
													/>
												);
											}

											const level = getLevel(day.count);
											const countLabel =
												day.count === 0
													? "No activities"
													: `${day.count} ${day.count === 1 ? "activity" : "activities"}`;

											return (
												<OverlayTrigger
													key={day.key}
													placement="top"
													overlay={
														<Tooltip id={`activity-${day.key}`}>
															{countLabel} on {formatLongDate(day.date)}
														</Tooltip>
													}
												>
													<button
														type="button"
														role="gridcell"
														data-level={level}
														aria-label={`${countLabel} on ${formatLongDate(day.date)}`}
														onClick={() => openDay(day)}
														className="rounded-1 p-0 border-0"
														style={{
															width: CELL_SIZE,
															height: CELL_SIZE,
															marginBottom: CELL_GAP,
															backgroundColor: palette[level],
															boxShadow:
																"inset 0 0 0 1px rgba(27, 31, 35, 0.06)",
															cursor: "pointer",
														}}
													/>
												</OverlayTrigger>
											);
										})}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div
					className="d-flex align-items-center justify-content-end mt-2"
					style={{ gap: 3 }}
				>
					<span
						style={{
							fontSize: "0.75rem",
							color: "#57606a",
							marginRight: 3,
						}}
					>
						Less
					</span>
					{palette.map((color, level) => (
						<span
							key={color}
							className="rounded-1"
							title={
								level === 0
									? "No activity"
									: `Level ${level} of ${palette.length - 1}`
							}
							style={{
								width: CELL_SIZE,
								height: CELL_SIZE,
								backgroundColor: color,
								boxShadow: "inset 0 0 0 1px rgba(27, 31, 35, 0.06)",
							}}
						/>
					))}
					<span
						style={{ fontSize: "0.75rem", color: "#57606a", marginLeft: 3 }}
					>
						More
					</span>
				</div>

				<Modal
					show={showModal}
					onHide={() => setShowModal(false)}
					backdrop
					animation
					size="xl"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title as="h5">
							{selectedDay?.activities.length || 0}{" "}
							{selectedDay?.activities.length === 1 ? "activity" : "activities"}{" "}
							on {selectedDay?.label}
						</Modal.Title>
					</Modal.Header>
					<div className="modal-body p-0">
						{selectedDay?.activities.length > 0 ? (
							<ul className="list-group list-group-flush">
								{selectedDay.activities.map((activity, index) => (
									<li
										key={activity._id || index}
										className="list-group-item d-flex justify-content-between align-items-start gap-3"
									>
										<span>{activity.text}</span>
										<small className="text-muted text-nowrap">
											{new Date(activity.createdAt).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</small>
									</li>
								))}
							</ul>
						) : (
							<NothingFoundAlert classList="alert-dark m-0 rounded-0">
								No activity for this day
							</NothingFoundAlert>
						)}
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={() => setShowModal(false)}
						>
							Close
						</button>
					</div>
				</Modal>
			</div>

			{showTimeline && <Timeline activities={activities} />}
		</>
	);
};

export default ActivityChart;
