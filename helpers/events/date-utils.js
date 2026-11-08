export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function pad(n) {
	return String(n).padStart(2, "0");
}

export function toDay(date) {
	return `${pad(date.getMonth() + 1)}/${pad(
		date.getDate(),
	)}/${date.getFullYear()}`;
}

export function fromDay(day) {
	const parts = String(day || "").split("/");
	if (parts.length !== 3) return new Date();
	const month = Number(parts[0]) - 1;
	const date = Number(parts[1]);
	const year = Number(parts[2]);
	return new Date(year, month, date);
}

export function isoToDay(iso) {
	const parts = String(iso || "")
		.slice(0, 10)
		.split("-");
	if (parts.length !== 3) return toDay(new Date());
	return `${pad(Number(parts[1]))}/${pad(Number(parts[2]))}/${Number(parts[0])}`;
}

export function dayToIso(day) {
	const d = fromDay(day);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function dayTimeStamp(day, time) {
	return `${dayToIso(day)}T${String(time || "00:00").slice(0, 5)}`;
}

export function serverClock(date) {
	const now = date || new Date();
	const day = toDay(now);
	return {
		today: day,
		stamp: `${dayToIso(day)}T${pad(now.getHours())}:${pad(now.getMinutes())}`,
	};
}

export function dayDiff(startDay, endDay) {
	const start = fromDay(startDay).setHours(0, 0, 0, 0);
	const end = fromDay(endDay).setHours(0, 0, 0, 0);
	return Math.round((end - start) / 86400000);
}

export function dayRange(startDay, endDay, maxDays = 366) {
	if (!startDay) return [];
	if (!endDay || endDay === startDay) return [startDay];

	const span = dayDiff(startDay, endDay);
	if (!Number.isFinite(span) || span < 1) return [startDay];

	const total = Math.min(span, maxDays - 1);
	const keys = [];
	let cursor = fromDay(startDay);
	for (let i = 0; i <= total; i++) {
		keys.push(toDay(cursor));
		cursor = addDays(cursor, 1);
	}
	return keys;
}

export function toDateTime(day, time) {
	const base = fromDay(day);
	const [hours, minutes] = String(time || "00:00").split(":");
	base.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
	return base;
}

export function toFullCalendarFormat(day, time) {
	const d = fromDay(day);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${
		time || "00:00"
	}:00`;
}

export function formatTime(time) {
	const [rawHours, rawMinutes] = String(time || "00:00").split(":");
	let hours = Number(rawHours) || 0;
	const suffix = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12;
	return `${hours}:${rawMinutes || "00"} ${suffix}`;
}

export function addDays(date, amount) {
	const next = new Date(date);
	next.setDate(next.getDate() + amount);
	return next;
}

export function addMonths(date, amount) {
	const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
	return next;
}

export function addMonthsKeepDay(date, amount) {
	const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);

	const lastDay = new Date(
		target.getFullYear(),
		target.getMonth() + 1,
		0,
	).getDate();
	target.setDate(Math.min(date.getDate(), lastDay));
	return target;
}

export function startOfWeek(date) {
	const next = new Date(date);
	next.setHours(0, 0, 0, 0);
	return addDays(next, -next.getDay());
}

export function isSameDay(a, b) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function isToday(date) {
	return isSameDay(date, new Date());
}

export function monthMatrix(date) {
	const first = new Date(date.getFullYear(), date.getMonth(), 1);
	const start = startOfWeek(first);
	const weeks = [];
	let cursor = start;
	for (let w = 0; w < 6; w++) {
		const week = [];
		for (let d = 0; d < 7; d++) {
			week.push(cursor);
			cursor = addDays(cursor, 1);
		}
		weeks.push(week);
	}
	return weeks;
}

export function weekDays(date) {
	const start = startOfWeek(date);
	const days = [];
	for (let i = 0; i < 7; i++) days.push(addDays(start, i));
	return days;
}

export function monthLabel(date) {
	return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function weekLabel(date) {
	const days = weekDays(date);
	const start = days[0];
	const end = days[6];
	if (start.getMonth() === end.getMonth()) {
		return `${
			MONTHS[start.getMonth()]
		} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
	}
	return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${
		MONTHS[end.getMonth()]
	} ${end.getDate()}, ${end.getFullYear()}`;
}

export function longDayLabel(date) {
	return `${WEEKDAYS[date.getDay()]}, ${
		MONTHS[date.getMonth()]
	} ${date.getDate()}, ${date.getFullYear()}`;
}

export function slugify(value) {
	return (
		String(value || "")
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-") || "untitled"
	);
}
