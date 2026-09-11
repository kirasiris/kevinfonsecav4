// Front-end mirror of the Mongoose Event schema, plus the translation layer
// between the API documents and the shape the calendar components render.

import {
	addDays,
	addMonthsKeepDay,
	dayDiff,
	dayRange,
	dayToIso,
	fromDay,
	isoToDay,
	slugify,
	toDay,
	toFullCalendarFormat,
} from "./date-utils";

export const METHODS = ["phone", "video-interview", "face-to-face"];
export const PRIORITIES = ["low", "medium", "urgent"];
export const STATUSES = ["draft", "published", "trash", "scheduled"];

/** Only these two are offered in the form; `task` exists for legacy documents. */
export const POST_TYPES = ["appointment", "event"];
export const ALL_POST_TYPES = ["appointment", "event", "task"];

export const POST_TYPE_LABELS = {
	appointment: "Appointment",
	event: "Event",
	task: "Task",
};

export const POST_TYPE_HINTS = {
	appointment: "A single slot on one day, with a start time and a duration.",
	event:
		"Can run across several days. Useful for trips, holidays or conferences.",
	task: "Legacy entry type.",
};

export const METHOD_LABELS = {
	phone: "Phone call",
	"video-interview": "Video interview",
	"face-to-face": "Face to face",
};

export const PRIORITY_VARIANTS = {
	low: "secondary",
	medium: "warning",
	urgent: "danger",
};

export const STATUS_VARIANTS = {
	draft: "secondary",
	published: "success",
	scheduled: "info",
	trash: "danger",
};

export const RESPONSE_VARIANTS = {
	accepted: "success",
	pending: "warning",
	declined: "danger",
};

let counter = 0;
function objectId() {
	counter += 1;
	const stamp = Math.floor(Date.now() / 1000).toString(16);
	return `${stamp}${String(counter).padStart(6, "0")}${Math.random()
		.toString(16)
		.slice(2, 12)}`.slice(0, 24);
}

/* ------------------------------------------------------------------ */
/* Recurrence: the API stores a string, the UI edits an object         */
/* ------------------------------------------------------------------ */

export const FREQUENCIES = ["daily", "weekly", "monthly"];

export const FREQUENCY_LABELS = {
	daily: "Daily",
	weekly: "Weekly",
	monthly: "Monthly",
};

const FREQUENCY_UNITS = { daily: "day", weekly: "week", monthly: "month" };

/**
 * Hard ceiling on how many occurrences a single rule may generate.
 * An open-ended daily rule is infinite by definition, so every expansion is
 * bounded to keep a corrupt or unbounded rule from hanging a render.
 */
export const MAX_OCCURRENCES = 500;

/** A rule only repeats when it carries a frequency we understand. */
export function isRecurring(value) {
	const rule = parseRecurrence(value);
	return Boolean(rule && rule.freq && FREQUENCIES.includes(rule.freq));
}

/**
 * { freq: 'weekly', interval: 2, count: 10 } -> "FREQ=WEEKLY;INTERVAL=2;COUNT=10"
 *
 * COUNT and UNTIL are mutually exclusive per RFC 5545, and COUNT wins here so a
 * half-filled form can never emit a rule that terminates two different ways.
 */
export function recurrenceToString(rule) {
	if (!rule || !rule.freq) return "";
	const parts = [`FREQ=${String(rule.freq).toUpperCase()}`];
	const interval = Number(rule.interval) || 1;
	if (interval > 1) parts.push(`INTERVAL=${interval}`);
	if (rule.count) parts.push(`COUNT=${Number(rule.count)}`);
	else if (rule.until)
		parts.push(`UNTIL=${dayToIso(rule.until).replace(/-/g, "")}`);
	return parts.join(";");
}

/** "FREQ=WEEKLY;INTERVAL=2" -> { freq: 'weekly', interval: 2 } */
export function parseRecurrence(value) {
	if (!value) return {};
	if (typeof value === "object") return value;
	const rule = {};
	String(value)
		.split(";")
		.forEach((chunk) => {
			const [rawKey, rawValue] = chunk.split("=");
			if (!rawKey || !rawValue) return;
			const key = rawKey.trim().toUpperCase();
			const raw = rawValue.trim();
			if (key === "FREQ") rule.freq = raw.toLowerCase();
			if (key === "INTERVAL") rule.interval = Number(raw);
			if (key === "COUNT") rule.count = Number(raw);
			if (key === "UNTIL") {
				// Accept the RFC's compact "20260930" as well as plain "2026-09-30".
				const iso = raw.includes("-")
					? raw.slice(0, 10)
					: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
				rule.until = isoToDay(iso);
			}
		});
	return rule;
}

export function recurrenceLabel(value) {
	const rule = parseRecurrence(value);
	if (!rule || !rule.freq) return "Does not repeat";
	const interval = Number(rule.interval) || 1;
	const unit = FREQUENCY_UNITS[rule.freq] || rule.freq;
	// "Repeats weekly" for the common case, "Repeats every 3 weeks" otherwise.
	const every =
		interval > 1
			? `every ${interval} ${unit}s`
			: (FREQUENCY_LABELS[rule.freq] || rule.freq).toLowerCase();
	if (rule.count) return `Repeats ${every} · ${rule.count} times`;
	if (rule.until) return `Repeats ${every} · until ${rule.until}`;
	return `Repeats ${every}`;
}

/* ------------------------------------------------------------------ */
/* Normalizing API documents                                           */
/* ------------------------------------------------------------------ */

/**
 * `text` comes back either as plain text, as { body }, or as the
 * server-side encrypted envelope { iv, encryptedData }.
 */
function readText(text) {
	if (!text) return { body: "", encrypted: false };
	if (typeof text === "string") return { body: text, encrypted: false };
	if (typeof text === "object") {
		if (typeof text.body === "string")
			return { body: text.body, encrypted: false };
		if (text.encryptedData) return { body: "", encrypted: true };
	}
	return { body: "", encrypted: false };
}

/** Accepts either "YYYY-MM-DD" or "MM/DD/YYYY" and always returns the latter. */
function readDay(value, fallback) {
	const raw = String(value || "").trim();
	if (!raw) return fallback;
	return raw.includes("-") ? isoToDay(raw) : raw;
}

/**
 * The old schema declared `postType` as a nested object, so documents written
 * before the migration arrive as `{ postType: { postType: 'event' } }`.
 * Both shapes are accepted here.
 */
function readPostType(value) {
	const raw = value && typeof value === "object" ? value.postType : value;
	const candidate = String(raw || "")
		.trim()
		.toLowerCase();
	if (ALL_POST_TYPES.includes(candidate)) return candidate;
	return "appointment";
}

/**
 * `location` is a GeoJSON Point in the schema, not a label — the readable
 * string lives in `address`, with `location.formattedAddress` filled in by the
 * geocoder. Returning the raw object here crashes React with "Objects are not
 * valid as a React child", so a string is always produced.
 */
function readLocation(input) {
	const raw = input.location;
	if (typeof raw === "string" && raw.trim()) return raw;
	if (
		raw &&
		typeof raw === "object" &&
		typeof raw.formattedAddress === "string" &&
		raw.formattedAddress
	) {
		return raw.formattedAddress;
	}
	return typeof input.address === "string" ? input.address : "";
}

/** Takes one document from the API and returns the shape components expect. */
export function normalizeEvent(doc) {
	const input = doc || {};
	const day = readDay(input.day, toDay(new Date()));
	const postType = readPostType(input.postType);
	const allDay = input.allDay === true || input.allDay === "true";
	const time = allDay ? "00:00" : input.time || "09:00";
	const title = input.title || "Untitled";
	const note = readText(input.text);

	// Only an `event` may span days, and the range must move forward.
	const rawEndDay = postType === "event" ? readDay(input.endDay, "") : "";
	const endDay = rawEndDay && dayDiff(day, rawEndDay) > 0 ? rawEndDay : "";

	return {
		postType,
		allDay,
		endDay,
		_id: input._id || objectId(),
		user: input.user || null,
		authorName: (input.user && input.user.name) || "",
		title,
		slug: input.slug || slugify(title),
		text: { body: note.body },
		textEncrypted: note.encrypted,
		excerpt: input.excerpt || "No excerpt",
		fullCalendarDateFormat:
			input.fullCalendarDateFormat || toFullCalendarFormat(day, time),
		day,
		time,
		durationMinutes: allDay ? 0 : Number(input.durationMinutes) || 30,
		method: METHODS.includes(input.method) ? input.method : "face-to-face",
		priority: PRIORITIES.includes(input.priority) ? input.priority : "low",
		location: readLocation(input),
		attendees: (input.attendees || []).map((person) => ({
			name: person.name || "",
			email: person.email || "",
			phoneNumber: person.phoneNumber || "",
			role: person.role || "guest",
			response: person.response || "pending",
		})),
		recurrenceRule: parseRecurrence(input.recurrenceRule),
		status: STATUSES.includes(input.status) ? input.status : "published",
		createdAt: input.createdAt || new Date().toISOString(),
		updatedAt: input.updatedAt || new Date().toISOString(),
	};
}

/* ------------------------------------------------------------------ */
/* Multi-day helpers                                                   */
/* ------------------------------------------------------------------ */

export function isMultiDay(event) {
	return Boolean(event && event.endDay && dayDiff(event.day, event.endDay) > 0);
}

/** Inclusive day count. 1 for anything that lives on a single day. */
export function spanDays(event) {
	if (!isMultiDay(event)) return 1;
	return dayDiff(event.day, event.endDay) + 1;
}

/** Every "MM/DD/YYYY" key the entry occupies, so grids can repeat it. */
export function eventDayKeys(event) {
	if (!event) return [];
	if (!isMultiDay(event)) return [event.day];
	return dayRange(event.day, event.endDay);
}

/**
 * Where a given day sits inside the entry's range. Lets a cell render the
 * correct rounded edge and a "day 2 of 5" label without recomputing the span.
 */
export function segmentInfo(event, day) {
	const total = spanDays(event);
	if (total === 1) return { index: 1, total: 1, isStart: true, isEnd: true };
	const index = dayDiff(event.day, day) + 1;
	return { index, total, isStart: index === 1, isEnd: index === total };
}

/** "Mar 3 – Mar 7, 2025" style range, or a single long day label. */
export function rangeLabel(event, formatter) {
	if (!isMultiDay(event)) return formatter(event.day);
	return `${formatter(event.day)} – ${formatter(event.endDay)}`;
}

/* ------------------------------------------------------------------ */
/* Full-day occupancy                                                  */
/* ------------------------------------------------------------------ */

/**
 * Does this entry consume a whole day, leaving no room for another booking?
 *
 * Two shapes qualify, matching how the week view already lumps both into its
 * "All day" band: an explicit all-day entry, and any day covered by a
 * multi-day span. A trashed entry occupies nothing — it is only still in the
 * list so the trash filter can show it.
 */
export function blocksDay(event) {
	if (!event || event.status === "trash") return false;
	return event.allDay === true || isMultiDay(event);
}

/**
 * The entry that makes `day` unavailable, or null when the day is free.
 *
 * Returns the blocker itself rather than a boolean so callers can name it in
 * the message — "Team offsite already takes that day" is far more useful than
 * a bare refusal. Pass expanded occurrences so a recurring all-day series
 * blocks every day it lands on, not just its anchor.
 */
export function findDayBlocker(events, day, ignoreId) {
	if (!day) return null;
	const list = events || [];
	for (let i = 0; i < list.length; i++) {
		const event = list[i];
		if (!blocksDay(event)) continue;
		// Skip the entry being moved, so dragging it within its own span is not
		// rejected by its own occupancy.
		if (ignoreId && (event._id === ignoreId || event.seriesId === ignoreId))
			continue;
		if (eventDayKeys(event).includes(day)) return event;
	}
	return null;
}

/* ------------------------------------------------------------------ */
/* Recurrence expansion                                                */
/* ------------------------------------------------------------------ */

/**
 * The nth occurrence date, always measured from the anchor rather than from
 * the previous occurrence.
 *
 * Stepping month-by-month would drift on short months: Jan 31 clamps to Feb 28,
 * and adding a month to *that* gives Mar 28 instead of Mar 31. Computing
 * `anchor + n*interval` in one hop keeps every occurrence tied to the original
 * day-of-month.
 */
function occurrenceDate(anchor, freq, interval, index) {
	if (index === 0) return anchor;
	if (freq === "daily") return addDays(anchor, interval * index);
	if (freq === "weekly") return addDays(anchor, 7 * interval * index);
	if (freq === "monthly") return addMonthsKeepDay(anchor, interval * index);
	return anchor;
}

/**
 * Cheap lower bound for the first occurrence that could touch the window.
 *
 * Without this, a rule anchored years in the past would burn its entire
 * MAX_OCCURRENCES budget stepping through dates nobody is looking at, and the
 * visible occurrences would never be reached. Deliberately conservative: it can
 * start too early, never too late.
 */
function firstIndexNear(anchorDay, freq, interval, windowStartDay, span) {
	const delta = dayDiff(anchorDay, windowStartDay) - span;
	if (delta <= 0) return 0;
	if (freq === "daily") return Math.floor(delta / interval);
	if (freq === "weekly") return Math.floor(delta / (7 * interval));
	if (freq === "monthly") {
		const a = fromDay(anchorDay);
		const w = fromDay(windowStartDay);
		const months =
			(w.getFullYear() - a.getFullYear()) * 12 + (w.getMonth() - a.getMonth());
		// One month of slack absorbs the day-of-month clamping above.
		return Math.max(0, Math.floor((months - 1) / interval));
	}
	return 0;
}

/** Clones the series into a single dated instance. */
function makeOccurrence(event, day, endDay, index, total) {
	const base = {
		...event,
		day,
		endDay,
		fullCalendarDateFormat: toFullCalendarFormat(day, event.time),
		seriesId: event._id,
		occurrenceIndex: index,
		occurrenceTotal: total,
	};
	// Index 0 IS the stored document, so it keeps the real _id and stays
	// editable/draggable. Later instances are virtual and get a derived id.
	if (index === 0) return { ...base, isOccurrence: false };
	return { ...base, _id: `${event._id}::${dayToIso(day)}`, isOccurrence: true };
}

/**
 * Expands one event into every occurrence that overlaps
 * [windowStartDay, windowEndDay], inclusive.
 *
 * Recurring entries are stored as a single document plus a rule — never as N
 * rows — so the calendar has to materialise them per view. A non-recurring
 * event expands to exactly itself, which lets callers map over everything
 * without special-casing.
 */
export function expandRecurrence(event, windowStartDay, windowEndDay) {
	if (!event) return [];

	const rule = parseRecurrence(event.recurrenceRule);
	if (!rule.freq || !FREQUENCIES.includes(rule.freq)) {
		return [
			{
				...event,
				seriesId: event._id,
				occurrenceIndex: 0,
				occurrenceTotal: 1,
				isOccurrence: false,
			},
		];
	}

	const interval = Math.max(1, Number(rule.interval) || 1);
	const count = Number(rule.count) > 0 ? Math.floor(Number(rule.count)) : 0;
	const until = rule.until || "";
	// Each occurrence keeps the span of the original.
	const span = isMultiDay(event) ? dayDiff(event.day, event.endDay) : 0;

	const anchor = fromDay(event.day);
	const startIndex = firstIndexNear(
		event.day,
		rule.freq,
		interval,
		windowStartDay,
		span,
	);

	const out = [];
	for (let step = 0; step < MAX_OCCURRENCES; step++) {
		const index = startIndex + step;
		if (count && index >= count) break;

		const date = occurrenceDate(anchor, rule.freq, interval, index);
		const day = toDay(date);

		// Past the series' own end date.
		if (until && dayDiff(day, until) < 0) break;
		// Past the window: every later occurrence is further away, so stop.
		if (dayDiff(windowEndDay, day) > 0) break;

		const endDay = span > 0 ? toDay(addDays(date, span)) : "";
		// Keep it only if it actually reaches into the window.
		if (dayDiff(windowStartDay, endDay || day) >= 0) {
			out.push(makeOccurrence(event, day, endDay, index, count || 0));
		}
	}

	return out;
}

/** Expands a whole list, flattened, for one visible window. */
export function expandAll(events, windowStartDay, windowEndDay) {
	const out = [];
	(events || []).forEach((event) => {
		expandRecurrence(event, windowStartDay, windowEndDay).forEach((item) =>
			out.push(item),
		);
	});
	return out;
}

/** Builds a local document with every schema default applied. */
export function createEvent(overrides) {
	return normalizeEvent({ _id: objectId(), ...(overrides || {}) });
}

export function attendee(name, email, role, response) {
	return {
		name: name || "",
		email: email || "",
		phoneNumber: "",
		role: role || "guest",
		response: response || "pending",
	};
}
