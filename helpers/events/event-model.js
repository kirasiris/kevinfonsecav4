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

export const FREQUENCIES = ["daily", "weekly", "monthly"];

export const FREQUENCY_LABELS = {
	daily: "Daily",
	weekly: "Weekly",
	monthly: "Monthly",
};

const FREQUENCY_UNITS = { daily: "day", weekly: "week", monthly: "month" };

export const MAX_OCCURRENCES = 500;

export function isRecurring(value) {
	const rule = parseRecurrence(value);
	return Boolean(rule && rule.freq && FREQUENCIES.includes(rule.freq));
}

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

	const every =
		interval > 1
			? `every ${interval} ${unit}s`
			: (FREQUENCY_LABELS[rule.freq] || rule.freq).toLowerCase();
	if (rule.count) return `Repeats ${every} · ${rule.count} times`;
	if (rule.until) return `Repeats ${every} · until ${rule.until}`;
	return `Repeats ${every}`;
}

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

function readDay(value, fallback) {
	const raw = String(value || "").trim();
	if (!raw) return fallback;
	return raw.includes("-") ? isoToDay(raw) : raw;
}

function readPostType(value) {
	const raw = value && typeof value === "object" ? value.postType : value;
	const candidate = String(raw || "")
		.trim()
		.toLowerCase();
	if (ALL_POST_TYPES.includes(candidate)) return candidate;
	return "appointment";
}

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

export function normalizeEvent(doc) {
	const input = doc || {};
	const day = readDay(input.day, toDay(new Date()));
	const postType = readPostType(input.postType);
	const allDay = input.allDay === true || input.allDay === "true";
	const time = allDay ? "00:00" : input.time || "09:00";
	const title = input.title || "Untitled";
	const note = readText(input.text);

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

export function isMultiDay(event) {
	return Boolean(event && event.endDay && dayDiff(event.day, event.endDay) > 0);
}

export function spanDays(event) {
	if (!isMultiDay(event)) return 1;
	return dayDiff(event.day, event.endDay) + 1;
}

export function eventDayKeys(event) {
	if (!event) return [];
	if (!isMultiDay(event)) return [event.day];
	return dayRange(event.day, event.endDay);
}

export function segmentInfo(event, day) {
	const total = spanDays(event);
	if (total === 1) return { index: 1, total: 1, isStart: true, isEnd: true };
	const index = dayDiff(event.day, day) + 1;
	return { index, total, isStart: index === 1, isEnd: index === total };
}

export function rangeLabel(event, formatter) {
	if (!isMultiDay(event)) return formatter(event.day);
	return `${formatter(event.day)} – ${formatter(event.endDay)}`;
}

export function blocksDay(event) {
	if (!event || event.status === "trash") return false;
	return event.allDay === true || isMultiDay(event);
}

export function findDayBlocker(events, day, ignoreId) {
	if (!day) return null;
	const list = events || [];
	for (let i = 0; i < list.length; i++) {
		const event = list[i];
		if (!blocksDay(event)) continue;
		if (ignoreId && (event._id === ignoreId || event.seriesId === ignoreId))
			continue;
		if (eventDayKeys(event).includes(day)) return event;
	}
	return null;
}

function occurrenceDate(anchor, freq, interval, index) {
	if (index === 0) return anchor;
	if (freq === "daily") return addDays(anchor, interval * index);
	if (freq === "weekly") return addDays(anchor, 7 * interval * index);
	if (freq === "monthly") return addMonthsKeepDay(anchor, interval * index);
	return anchor;
}

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

		return Math.max(0, Math.floor((months - 1) / interval));
	}
	return 0;
}

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
	if (index === 0) return { ...base, isOccurrence: false };
	return { ...base, _id: `${event._id}::${dayToIso(day)}`, isOccurrence: true };
}

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

		if (until && dayDiff(day, until) < 0) break;
		if (dayDiff(windowEndDay, day) > 0) break;

		const endDay = span > 0 ? toDay(addDays(date, span)) : "";
		if (dayDiff(windowStartDay, endDay || day) >= 0) {
			out.push(makeOccurrence(event, day, endDay, index, count || 0));
		}
	}

	return out;
}

export function expandAll(events, windowStartDay, windowEndDay) {
	const out = [];
	(events || []).forEach((event) => {
		expandRecurrence(event, windowStartDay, windowEndDay).forEach((item) =>
			out.push(item),
		);
	});
	return out;
}

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
