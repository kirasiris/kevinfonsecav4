// Plain JavaScript date helpers.
// The Mongoose model stores `day` as "MM/DD/YYYY" and `time` as "HH:mm" (24h),
// so every helper here speaks those two formats.

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

/** Date -> "MM/DD/YYYY" */
export function toDay(date) {
	return `${pad(date.getMonth() + 1)}/${pad(
		date.getDate(),
	)}/${date.getFullYear()}`;
}

/** "MM/DD/YYYY" -> Date (local, midnight) */
export function fromDay(day) {
	const parts = String(day || "").split("/");
	if (parts.length !== 3) return new Date();
	const month = Number(parts[0]) - 1;
	const date = Number(parts[1]);
	const year = Number(parts[2]);
	return new Date(year, month, date);
}

/** API format "YYYY-MM-DD" -> internal "MM/DD/YYYY" */
export function isoToDay(iso) {
	const parts = String(iso || "")
		.slice(0, 10)
		.split("-");
	if (parts.length !== 3) return toDay(new Date());
	return `${pad(Number(parts[1]))}/${pad(Number(parts[2]))}/${Number(parts[0])}`;
}

/** internal "MM/DD/YYYY" -> API format "YYYY-MM-DD" */
export function dayToIso(day) {
	const d = fromDay(day);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Sortable, timezone-free stamp: "YYYY-MM-DDTHH:mm".
 * Comparing these as plain strings avoids building Date objects during render,
 * which is what made the server and the browser disagree.
 */
export function dayTimeStamp(day, time) {
	return `${dayToIso(day)}T${String(time || "00:00").slice(0, 5)}`;
}

/**
 * A snapshot of "now" that can be serialized from the server to the client.
 * `today` is the "MM/DD/YYYY" key and `stamp` is the sortable form above.
 */
export function serverClock(date) {
	const now = date || new Date();
	const day = toDay(now);
	return {
		today: day,
		stamp: `${dayToIso(day)}T${pad(now.getHours())}:${pad(now.getMinutes())}`,
	};
}

/** Inclusive whole-day difference between two "MM/DD/YYYY" values. */
export function dayDiff(startDay, endDay) {
	const start = fromDay(startDay).setHours(0, 0, 0, 0);
	const end = fromDay(endDay).setHours(0, 0, 0, 0);
	return Math.round((end - start) / 86400000);
}

/**
 * Every "MM/DD/YYYY" key from `startDay` to `endDay`, inclusive.
 * Returns just the start when the range is empty, backwards, or absurd, so
 * callers never have to guard against a runaway loop.
 */
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

/** "MM/DD/YYYY" + "HH:mm" -> Date */
export function toDateTime(day, time) {
	const base = fromDay(day);
	const [hours, minutes] = String(time || "00:00").split(":");
	base.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);
	return base;
}

/** FullCalendar friendly ISO value: "YYYY-MM-DDTHH:mm:00" */
export function toFullCalendarFormat(day, time) {
	const d = fromDay(day);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${
		time || "00:00"
	}:00`;
}

/** "18:30" -> "6:30 PM" */
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

/**
 * Like `addMonths`, but keeps the day-of-month instead of snapping to the 1st.
 *
 * `addMonths` deliberately returns the first of the month because it drives the
 * month-view cursor, where the day is irrelevant. Monthly recurrence needs the
 * opposite: "the 31st, every month". Short months are clamped to their last day
 * (Jan 31 -> Feb 28), which is what calendars do.
 */
export function addMonthsKeepDay(date, amount) {
	const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
	// Day 0 of the following month is the last day of the target month.
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

/** 42 cells (6 weeks) covering the month that `date` belongs to. */
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
