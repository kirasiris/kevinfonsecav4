"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Form, Modal } from "react-bootstrap";
import {
	CalendarClock,
	CalendarOff,
	CalendarRange,
	MapPin,
	Phone,
	Users,
	Video,
} from "lucide-react";
import {
	WEEKDAYS,
	addDays,
	addMonths,
	dayDiff,
	dayRange,
	dayTimeStamp,
	dayToIso,
	formatTime,
	fromDay,
	longDayLabel,
	monthLabel,
	monthMatrix,
	serverClock,
	startOfWeek,
	toDateTime,
	toDay,
	toFullCalendarFormat,
	weekDays,
	weekLabel,
} from "@/helpers/events/date-utils";
import {
	FREQUENCIES,
	FREQUENCY_LABELS,
	METHODS,
	METHOD_LABELS,
	POST_TYPES,
	POST_TYPE_HINTS,
	POST_TYPE_LABELS,
	PRIORITIES,
	PRIORITY_VARIANTS,
	RESPONSE_VARIANTS,
	STATUSES,
	STATUS_VARIANTS,
	MAX_OCCURRENCES,
	attendee,
	eventDayKeys,
	expandAll,
	expandRecurrence,
	isMultiDay,
	isRecurring,
	normalizeEvent,
	recurrenceLabel,
	segmentInfo,
	spanDays,
} from "@/helpers/events/event-model";
import { toast } from "react-toastify";
import FormButtons from "@/components/global/formbuttons";
import { useAvailability } from "@/helpers/events/use-availability";
import { fetchurl } from "@/helpers/setTokenOnServer";

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

/**
 * Every write the scheduler makes, in one place.
 *
 * `fetchurl` is a server action, so these run on the server even though they
 * are called from this client component. That is what keeps the `xAuthToken`
 * cookie server-side: it never has to be readable from the browser, and there
 * is no CORS or credentials handling to get right.
 *
 * It resolves with the parsed JSON on success and, for a non-ok response,
 * resolves with the rejected error body instead of throwing — so a caller has
 * to inspect the payload rather than rely on try/catch. `readResult` does that
 * once and hands back a single predictable shape:
 *
 *   { ok, data, message, conflict, reason, day, blocker }
 *
 * Every scheduling rule — occupancy, conflicts, recurrence — is evaluated by
 * the API. Nothing here holds a copy of an event, so an unreachable backend
 * surfaces as an error instead of as stale or invented data.
 */

/**
 * Without this the request builds the path `undefined/noadmin/...` and fails
 * with a URL parse error that reads like a bug in the scheduler rather than a
 * missing environment variable.
 */
function missingApiUrl() {
	return {
		ok: false,
		message:
			"The scheduler API is not configured. Set NEXT_PUBLIC_API_URL to the address of the events API.",
	};
}

function readResult(res) {
	if (!res || typeof res !== "object") {
		return { ok: false, message: "No response from the API." };
	}

	// A transport failure arrives as an Error instance, and it survives the
	// server-action boundary intact. Its message is a Node internal — "fetch
	// failed" for an unreachable host — so it is replaced rather than shown.
	if (res instanceof Error) {
		return {
			ok: false,
			message: "Could not reach the scheduler API. Please try again.",
		};
	}

	if (res.success === true) {
		return { ok: true, data: res.data, changed: res.changed !== false };
	}

	return {
		ok: false,
		conflict: res.conflict === true,
		reason: res.reason || "",
		day: res.day || "",
		blocker: res.blocker || null,
		message:
			res.message ||
			res.error ||
			"Could not complete the request. Please try again.",
	};
}

/**
 * The guard, the transport and the error shape live here so each verb below is
 * only its path, method and body.
 */
async function request(path, method, body) {
	if (!process.env.NEXT_PUBLIC_API_URL) return missingApiUrl();

	try {
		return readResult(await fetchurl(path, method, "no-cache", body));
	} catch {
		// These cross a server-action boundary, so a transport failure that could
		// not be turned into a payload arrives as a rejection rather than a value.
		return {
			ok: false,
			message: "Could not reach the scheduler API. Please try again.",
		};
	}
}

const createEventRequest = (payload) =>
	request(`/noadmin/events`, "POST", payload);

const updateEventRequest = (id, payload) =>
	request(`/noadmin/events/${id}`, "PUT", payload);

const rescheduleEventRequest = ({ id, day, force, allowPast }) =>
	request(`/noadmin/events/${id}/reschedule`, "PUT", {
		day,
		force: Boolean(force),
		allowPast: Boolean(allowPast),
	});

const trashEventRequest = (id) =>
	request(`/noadmin/events/${id}/trashit`, "PUT", {});

const restoreEventRequest = (id) =>
	request(`/noadmin/events/${id}/publishit`, "PUT", {});

const deleteEventRequest = (id) =>
	request(`/noadmin/events/${id}/permanently`, "PUT", {});

// ---------------------------------------------------------------------------
// 1. Constants
// ---------------------------------------------------------------------------

const VIEWS = [
	{ key: "month", label: "Month" },
	{ key: "week", label: "Week" },
	{ key: "agenda", label: "Agenda" },
];

const LOAD_ERROR_TOAST_ID = "load-error";
const AVAILABILITY_ERROR_TOAST_ID = "availability-error";

const DEFAULT_FILTERS = {
	search: "",
	method: "all",
	priority: "all",
	status: "all",
	hideTrash: true,
};

const START_HOUR = 7;
const END_HOUR = 21;
const ROW_HEIGHT = 52;

const WEEK_GUTTER = "4.5rem";
const WEEK_DAY_CELL = { flex: "1 1 0", minWidth: 0 };
const RECURRENCE_UNITS = { daily: "day", weekly: "week", monthly: "month" };
const MONTH_LANES = 3;
const LANE_HEIGHT = "1.2rem";

const minutesFromStart = (time) => {
	const [h, m] = String(time || "00:00").split(":");
	return (Number(h) - START_HOUR) * 60 + Number(m);
};

const toInputDate = (day) => {
	const d = fromDay(day);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
		2,
		"0",
	)}-${String(d.getDate()).padStart(2, "0")}`;
};

const fromInputDate = (value) => {
	const [y, m, d] = String(value || "").split("-");
	if (!y || !m || !d) return toDay(new Date());
	return toDay(new Date(Number(y), Number(m) - 1, Number(d)));
};

const blankDraft = (day) => {
	return {
		title: "",
		slug: "",
		excerpt: "",
		body: "",
		postType: "appointment",
		allDay: false,
		day: day || toDay(new Date()),
		endDay: "",
		time: "09:00",
		durationMinutes: 30,
		method: "face-to-face",
		priority: "low",
		status: "published",
		location: "",
		attendees: [],
		recurrenceRule: { freq: "", interval: 1, count: "", until: "" },
	};
};

const toDraft = (event) => {
	return {
		title: event.title,
		slug: event.slug,
		excerpt: event.excerpt === "No excerpt" ? "" : event.excerpt,
		body: (event.text && event.text.body) || "",
		postType: event.postType === "event" ? "event" : "appointment",
		allDay: Boolean(event.allDay),
		day: event.day,
		endDay: event.endDay || "",
		time: event.time,
		durationMinutes: event.durationMinutes || 30,
		method: event.method,
		priority: event.priority,
		status: event.status,
		location: event.location || "",
		attendees: (event.attendees || []).map((person) => ({
			...person,
			phoneNumber: person.phoneNumber || "",
		})),
		// `until` has to round-trip too, or reopening a "repeat until" series would
		// silently downgrade it to an endless one on the next save.
		recurrenceRule: {
			freq: (event.recurrenceRule && event.recurrenceRule.freq) || "",
			interval: (event.recurrenceRule && event.recurrenceRule.interval) || 1,
			count: (event.recurrenceRule && event.recurrenceRule.count) || "",
			until: (event.recurrenceRule && event.recurrenceRule.until) || "",
		},
	};
};

/**
 * Attendee rows are uncontrolled, added and removed, so each row needs an
 * identity of its own. Keying by array index would let React reuse a row's DOM
 * node for its former neighbour after a removal — and with no `value` prop to
 * correct it, the deleted row's text would stay sitting in the next row.
 */
let rowSeq = 0;
const withRowIds = (people) =>
	(people || []).map((person) => ({
		...person,
		rowId: `attendee-${(rowSeq += 1)}`,
	}));

/**
 * The only fields kept in React state. Each one either changes what the rest
 * of the form renders (the type toggle, `allDay`, the dates, the recurrence
 * rule) or sits inside a branch that unmounts — `time` and `durationMinutes`
 * disappear when `allDay` is switched on, and an uncontrolled input would come
 * back holding its seed value instead of what the user picked.
 *
 * Everything else is uncontrolled and read from FormData on submit.
 */
const liveFrom = (seed) => ({
	postType: seed.postType,
	allDay: seed.allDay,
	day: seed.day,
	endDay: seed.endDay,
	time: seed.time,
	durationMinutes: seed.durationMinutes,
	method: seed.method,
	recurrenceRule: seed.recurrenceRule,
});

const MethodIcon = ({ method, size }) => {
	const props = { size: size || 12, "aria-hidden": true };
	if (method === "phone") return <Phone {...props} />;
	if (method === "video-interview") return <Video {...props} />;
	return <Users {...props} />;
};

const EventPill = ({ event, onSelect, draggable, pending, segment }) => {
	const variant = PRIORITY_VARIANTS[event.priority] || "secondary";
	const span = segment || { index: 1, total: 1, isStart: true, isEnd: true };
	const spanning = span.total > 1;

	// A spanning bar is tinted and squares off the edges that continue.
	const edges = spanning
		? `${
				span.isStart
					? "rounded-start-1 border-start border-3"
					: "rounded-0 ps-1"
			} ${span.isEnd ? "rounded-end-1" : "rounded-0 me-n1"}`
		: "rounded-1 border-start border-3";

	const label =
		spanning && !span.isStart
			? `${event.title} (${span.index}/${span.total})`
			: event.title;

	const timeLabel = event.allDay ? "All day" : formatTime(event.time);
	const repeats = isRecurring(event.recurrenceRule);

	return (
		<button
			type="button"
			aria-busy={pending ? "true" : undefined}
			draggable={draggable && !pending ? "true" : "false"}
			onDragStart={(e) => {
				e.dataTransfer.setData("text/plain", event._id);
				e.dataTransfer.effectAllowed = "move";
			}}
			onClick={(e) => {
				e.stopPropagation();
				onSelect(event);
			}}
			className={`btn btn-sm w-100 d-flex align-items-center gap-1 text-start px-1 py-0 mb-1 border-0 overflow-hidden text-body border-${variant} ${edges} ${
				spanning ? `bg-${variant}-subtle` : "bg-body-tertiary"
			} ${pending ? "opacity-50" : ""}`}
			style={{
				borderLeftStyle: "solid",
				fontSize: "0.72rem",
				lineHeight: 1.6,
				height: LANE_HEIGHT,
			}}
			title={`${timeLabel} · ${event.title}${
				spanning ? ` · day ${span.index} of ${span.total}` : ""
			}${
				repeats
					? ` · ${recurrenceLabel(event.recurrenceRule).toLowerCase()}`
					: ""
			}${
				event.isOccurrence
					? " · drag the first occurrence to move the series"
					: ""
			}`}
		>
			{/* On continuation days the icon and time would just be noise. */}
			{span.isStart ? (
				<>
					<span className={`text-${variant} d-flex flex-shrink-0`}>
						<MethodIcon method={event.method} />
					</span>
					{event.allDay ? (
						<span
							className="text-body-secondary text-uppercase text-nowrap flex-shrink-0"
							style={{ fontSize: "0.6rem" }}
						>
							All day
						</span>
					) : (
						/* The lane is a fixed 1.2rem tall, so this must never wrap — a
               second line would spill onto the entry below it. */
						<span className="font-monospace text-body-secondary text-nowrap flex-shrink-0">
							{formatTime(event.time)}
						</span>
					)}
				</>
			) : (
				<span className="text-body-secondary" aria-hidden="true">
					‹
				</span>
			)}
			<span className="text-truncate">{label}</span>
			{repeats && span.isStart ? (
				<span
					className="text-body-secondary d-flex flex-shrink-0"
					aria-hidden="true"
				>
					<i className="fa-solid fa-repeat" aria-hidden="true" />
				</span>
			) : null}
			{event.status !== "published" ? (
				<span
					className="ms-auto text-body-secondary text-uppercase"
					style={{ fontSize: "0.6rem" }}
				>
					{event.status.slice(0, 3)}
				</span>
			) : null}
		</button>
	);
};

const FiltersBar = ({ filters, setFilters, resetFilters }) => {
	const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

	return (
		<div className="row g-2 align-items-center">
			<div className="col-lg-3 col-md-6">
				<div className="input-group input-group-sm">
					<span className="input-group-text">
						<i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
					</span>
					<input
						id="keyword"
						name="keyword"
						value={filters.search}
						onChange={(e) => set("search", e.target.value)}
						type="text"
						className="form-control"
						placeholder="Search title, attendee or location"
						aria-label="Search appointments"
					/>
				</div>
			</div>
			<div className="col-lg-2 col-md-3 col-xs-6">
				<select
					id="method"
					name="method"
					value={filters.method}
					onChange={(e) => set("method", e.target.value)}
					className="form-select form-select-sm"
					aria-label="Filter by method"
				>
					<option value="all">All methods</option>
					{METHODS.map((method) => (
						<option key={method} value={method}>
							{METHOD_LABELS[method]}
						</option>
					))}
				</select>
			</div>
			<div className="col-lg-2 col-md-3 col-xs-6">
				<select
					id="priority"
					name="priority"
					value={filters.priority}
					onChange={(e) => set("priority", e.target.value)}
					className="form-select form-select-sm"
					aria-label="Filter by priority"
				>
					<option value="all">All priorities</option>
					{PRIORITIES.map((priority) => (
						<option key={priority} value={priority}>
							{priority}
						</option>
					))}
				</select>
			</div>
			<div className="col-lg-2 col-md-3 col-xs-6">
				<select
					id="status"
					name="status"
					value={filters.status}
					onChange={(e) => {
						const value = e.target.value;
						// Selecting the trash status while trash is hidden would filter to
						// an empty calendar, so the toggle gives way to the explicit pick.
						setFilters((prev) => ({
							...prev,
							status: value,
							hideTrash: value === "trash" ? false : prev.hideTrash,
						}));
					}}
					className="form-select form-select-sm"
					aria-label="Filter by status"
				>
					<option value="all">All statuses</option>
					{STATUSES.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>
			</div>
			<div className="col-lg-3 col-md-6 d-flex align-items-center gap-3">
				<div className="form-check form-switch text-nowrap">
					<input
						id="hide-trash"
						name="hide-trash"
						type="checkbox"
						className="form-check-input"
						checked={filters.hideTrash}
						onChange={(e) => set("hideTrash", e.target.checked)}
					/>
					<label htmlFor="hide-trash" className="form-check-label">
						Hide trash
					</label>
				</div>
				<button
					type="button"
					className="btn btn-secondary btn-sm ms-auto"
					onClick={resetFilters}
				>
					{/* <X size={14} aria-hidden="true" className="me-1" /> */}
					<i className="fa-solid fa-xmark me-1" aria-hidden="true" />
					Reset
				</button>
			</div>
		</div>
	);
};

const buildWeekLanes = (week, eventsByDay) => {
	const dayKeys = week.map(toDay);
	const columnOf = new Map(dayKeys.map((day, index) => [day, index]));

	// Collect each event once per week, clipped to the columns it occupies here.
	const seen = new Set();
	const entries = [];
	dayKeys.forEach((day) => {
		(eventsByDay[day] || []).forEach((event) => {
			if (seen.has(event._id)) return;
			seen.add(event._id);

			const columns = eventDayKeys(event)
				.map((key) => columnOf.get(key))
				.filter((index) => index !== undefined);
			if (!columns.length) return;

			entries.push({
				event,
				start: Math.min(...columns),
				end: Math.max(...columns),
			});
		});
	});

	entries.sort((a, b) => {
		// Widest first, so long bars get the top lanes and stay unbroken.
		const width = b.end - b.start - (a.end - a.start);
		if (width !== 0) return width;
		const aBand = a.event.allDay || isMultiDay(a.event) ? 0 : 1;
		const bBand = b.event.allDay || isMultiDay(b.event) ? 0 : 1;
		if (aBand !== bBand) return aBand - bBand;
		if (a.start !== b.start) return a.start - b.start;
		return a.event.time.localeCompare(b.event.time);
	});

	const lanes = [];
	entries.forEach((entry) => {
		let lane = lanes.findIndex((occupied) => {
			for (let i = entry.start; i <= entry.end; i++)
				if (occupied[i]) return false;
			return true;
		});
		if (lane === -1) {
			lanes.push(new Array(dayKeys.length).fill(false));
			lane = lanes.length - 1;
		}
		for (let i = entry.start; i <= entry.end; i++) lanes[lane][i] = true;
		entry.lane = lane;
	});

	// Sparse per-day lane slots: a gap stays empty so the row keeps its grid.
	const slotsByDay = {};
	const overflowByDay = {};
	dayKeys.forEach((day) => {
		slotsByDay[day] = new Array(MONTH_LANES).fill(null);
		overflowByDay[day] = [];
	});

	entries.forEach((entry) => {
		for (let i = entry.start; i <= entry.end; i++) {
			const day = dayKeys[i];
			if (entry.lane < MONTH_LANES) slotsByDay[day][entry.lane] = entry.event;
			else overflowByDay[day].push(entry.event);
		}
	});

	// Trailing lanes nobody uses would just pad every cell with dead space.
	const usedLanes = Math.min(lanes.length, MONTH_LANES);

	return { slotsByDay, overflowByDay, usedLanes };
};

const MonthView = ({
	cursor,
	todayKey,
	eventsByDay,
	blockedDays,
	pendingId,
	onMove,
	onSelectEvent,
	onCreateAt,
}) => {
	const [dragOverDay, setDragOverDay] = useState(null);

	// `monthMatrix` builds 42 Date objects, and the lane pass walks every entry
	// in the month. Both are keyed off the visible month rather than the Date
	// instance, which changes identity on every render.
	const monthKey = `${cursor.getFullYear()}-${cursor.getMonth()}`;
	const weeks = useMemo(() => monthMatrix(cursor), [monthKey]); // eslint-disable-line react-hooks/exhaustive-deps
	const layouts = useMemo(
		() => weeks.map((week) => buildWeekLanes(week, eventsByDay)),
		[weeks, eventsByDay],
	);

	return (
		<div className="border-top border-start rounded-2 overflow-hidden">
			<div className="d-flex bg-body-tertiary">
				{WEEKDAYS.map((label) => (
					<div
						key={label}
						className="flex-fill border-end border-bottom px-2 py-1 text-uppercase small fw-semibold text-body-secondary"
						style={{ width: "14.2857%" }}
					>
						{label}
					</div>
				))}
			</div>

			{weeks.map((week, weekIndex) => {
				const layout = layouts[weekIndex];
				return (
					<div className="d-flex" key={weekIndex}>
						{week.map((date) => {
							const day = toDay(date);
							const slots = layout.slotsByDay[day] || [];
							const overflow = layout.overflowByDay[day] || [];
							const outside = date.getMonth() !== cursor.getMonth();
							const today = day === todayKey;
							// A fully-occupied day accepts neither a new booking nor a drop, so
							// it drops the drag highlight that would otherwise promise one.
							const blocked = blockedDays.has(day);
							const isDragTarget = dragOverDay === day && !blocked;

							return (
								<div
									key={day}
									onDragOver={(e) => {
										e.preventDefault();
										setDragOverDay(day);
									}}
									onDragLeave={() =>
										setDragOverDay((prev) => (prev === day ? null : prev))
									}
									onDrop={(e) => {
										e.preventDefault();
										const id = e.dataTransfer.getData("text/plain");
										if (id) onMove(id, day);
										setDragOverDay(null);
									}}
									onDoubleClick={() => onCreateAt(day)}
									className={`flex-fill border-end border-bottom p-1 position-relative ${
										outside ? "bg-body-tertiary bg-opacity-25" : ""
									} ${isDragTarget ? "bg-primary bg-opacity-10" : ""} ${
										blocked ? "day-blocked" : ""
									}`}
									style={{ width: "14.2857%", minHeight: "7.5rem" }}
								>
									<div className="d-flex align-items-center justify-content-between mb-1">
										<span
											className={`font-monospace small ${
												today
													? "badge rounded-pill text-bg-primary"
													: outside
														? "text-body-secondary opacity-50"
														: "text-body-secondary"
											}`}
										>
											{date.getDate()}
										</span>
										{/*
										 * Still a button when blocked, not a removed control: the
										 * click is what explains WHY the day is unavailable. A
										 * silently missing affordance reads as a rendering bug.
										 */}
										<button
											type="button"
											className={`btn btn-sm btn-link p-0 lh-1 ${
												blocked ? "link-danger" : "link-secondary"
											}`}
											onClick={() => onCreateAt(day)}
											aria-label={
												blocked
													? `${day} is fully booked`
													: `Add appointment on ${day}`
											}
										>
											{blocked ? (
												<>
													{/* <Lock size={12} aria-hidden="true" /> */}
													<i className="fa-solid fa-lock" aria-hidden="true" />
												</>
											) : (
												<>
													{/* <Plus size={14} aria-hidden="true" /> */}
													<i className="fa-solid fa-plus" aria-hidden="true" />
												</>
											)}
										</button>
									</div>

									{/*
									 * Fixed lanes, so a span sits at the same height all week. An
									 * unused lane renders as an empty spacer to hold the grid.
									 */}
									{slots
										.slice(0, layout.usedLanes)
										.map((event, lane) =>
											event ? (
												<EventPill
													key={event._id}
													event={event}
													segment={segmentInfo(event, day)}
													onSelect={onSelectEvent}
													draggable={!event.isOccurrence}
													pending={pendingId === event._id}
												/>
											) : (
												<div
													key={`lane-${lane}`}
													className="mb-1"
													style={{ height: LANE_HEIGHT }}
													aria-hidden="true"
												/>
											),
										)}

									{overflow.length ? (
										<button
											type="button"
											className="btn btn-sm btn-link link-secondary p-0 small text-decoration-none"
											onClick={() => onSelectEvent(overflow[0])}
										>
											+{overflow.length} more
										</button>
									) : null}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

const WeekView = ({
	cursor,
	todayKey,
	eventsByDay,
	blockedDays,
	pendingId,
	onMove,
	onSelectEvent,
	onCreateAt,
}) => {
	const [dragOverDay, setDragOverDay] = useState(null);
	const days = weekDays(cursor);
	const hours = [];
	for (let h = START_HOUR; h < END_HOUR; h++) hours.push(h);
	const gridHeight = hours.length * ROW_HEIGHT;

	// Split each day's entries: banded (all-day / spanning) vs positioned.
	const allDayByDay = {};
	const timedByDay = {};
	days.forEach((date) => {
		const day = toDay(date);
		const list = eventsByDay[day] || [];
		allDayByDay[day] = list.filter(
			(event) => event.allDay || isMultiDay(event),
		);
		timedByDay[day] = list.filter(
			(event) => !event.allDay && !isMultiDay(event),
		);
	});
	const hasAllDay = days.some(
		(date) => (allDayByDay[toDay(date)] || []).length > 0,
	);

	return (
		/*
		 * The header, the all-day band and the hour grid are three separate flex
		 * rows that must line up column-for-column, so they all share
		 * WEEK_GUTTER and WEEK_DAY_CELL rather than restating their own widths.
		 *
		 * They also live inside ONE scroll container, with the header block stuck
		 * to the top. When the header sat outside it, the grid's vertical
		 * scrollbar narrowed only the grid row; that lost width was redivided
		 * across the seven flexible columns, so every divider drifted a little
		 * further left than the one before it.
		 */
		<div
			className="border rounded-2"
			style={{ maxHeight: "32rem", overflowY: "auto" }}
		>
			<div
				className="position-sticky top-0 bg-body-tertiary"
				style={{ zIndex: 2 }}
			>
				<div className="d-flex border-bottom">
					<div
						className="border-end flex-shrink-0"
						style={{ width: WEEK_GUTTER }}
					/>
					{days.map((date, i) => (
						<div
							key={toDay(date)}
							className="border-end px-2 py-1 text-center"
							style={WEEK_DAY_CELL}
						>
							<div
								className="text-uppercase text-body-secondary"
								style={{ fontSize: "0.7rem" }}
							>
								{WEEKDAYS[i]}
							</div>
							<div
								className={`fw-semibold ${
									toDay(date) === todayKey ? "text-primary" : ""
								}`}
							>
								{date.getDate()}
							</div>
						</div>
					))}
				</div>

				{/*
				 * All-day and multi-day entries sit in their own band above the hour
				 * grid. Placing them in the grid would pin them to 00:00, which is
				 * outside the visible 7am–9pm window.
				 */}
				{hasAllDay ? (
					<div className="d-flex border-bottom">
						<div
							className="border-end px-2 py-1 text-uppercase text-body-secondary text-end flex-shrink-0"
							style={{ width: WEEK_GUTTER, fontSize: "0.6rem" }}
						>
							All day
						</div>
						{days.map((date) => {
							const day = toDay(date);
							return (
								<div
									key={day}
									className="border-end p-1"
									style={{ ...WEEK_DAY_CELL, minHeight: "2.25rem" }}
									onDragOver={(e) => e.preventDefault()}
									onDrop={(e) => {
										e.preventDefault();
										const id = e.dataTransfer.getData("text/plain");
										if (id) onMove(id, day);
									}}
									onDoubleClick={() => onCreateAt(day)}
								>
									{(allDayByDay[day] || []).map((event) => (
										<EventPill
											key={event._id}
											event={event}
											segment={segmentInfo(event, day)}
											onSelect={onSelectEvent}
											draggable={!event.isOccurrence}
											pending={pendingId === event._id}
										/>
									))}
								</div>
							);
						})}
					</div>
				) : null}
			</div>
			<div className="d-flex">
				<div
					className="border-end flex-shrink-0"
					style={{ width: WEEK_GUTTER }}
				>
					{hours.map((h) => (
						<div
							key={h}
							className="border-bottom px-2 font-monospace text-body-secondary text-end"
							style={{ height: `${ROW_HEIGHT}px`, fontSize: "0.7rem" }}
						>
							{formatTime(`${String(h).padStart(2, "0")}:00`)}
						</div>
					))}
				</div>

				{days.map((date) => {
					const day = toDay(date);
					const dayEvents = timedByDay[day] || [];
					const blocked = blockedDays.has(day);
					return (
						<div
							key={day}
							className={`border-end position-relative ${
								dragOverDay === day && !blocked
									? "bg-primary bg-opacity-10"
									: ""
							} ${blocked ? "day-blocked" : ""}`}
							style={{ ...WEEK_DAY_CELL, height: `${gridHeight}px` }}
							onDragOver={(e) => {
								e.preventDefault();
								setDragOverDay(day);
							}}
							onDragLeave={() =>
								setDragOverDay((prev) => (prev === day ? null : prev))
							}
							onDrop={(e) => {
								e.preventDefault();
								const id = e.dataTransfer.getData("text/plain");
								if (id) onMove(id, day);
								setDragOverDay(null);
							}}
							onDoubleClick={() => onCreateAt(day)}
						>
							{hours.map((h) => (
								<div
									key={h}
									className="border-bottom"
									style={{ height: `${ROW_HEIGHT}px` }}
								/>
							))}

							{dayEvents.map((event) => {
								const offset = minutesFromStart(event.time);
								const top = Math.max(0, (offset / 60) * ROW_HEIGHT);
								const height = Math.max(
									44,
									((event.durationMinutes || 30) / 60) * ROW_HEIGHT - 2,
								);
								const variant =
									PRIORITY_VARIANTS[event.priority] || "secondary";
								const pending = pendingId === event._id;
								return (
									<button
										key={event._id}
										type="button"
										draggable={pending || event.isOccurrence ? "false" : "true"}
										aria-busy={pending ? "true" : undefined}
										onDragStart={(e) =>
											e.dataTransfer.setData("text/plain", event._id)
										}
										onClick={() => onSelectEvent(event)}
										className={`btn position-absolute start-0 end-0 mx-1 d-flex flex-column justify-content-start text-start p-1 border-0 border-start border-3 border-${variant} bg-body-tertiary text-body rounded-1 overflow-hidden ${
											pending ? "opacity-50" : ""
										}`}
										style={{
											top: `${top}px`,
											height: `${height}px`,
											borderLeftStyle: "solid",
											fontSize: "0.7rem",
											lineHeight: 1.25,
										}}
									>
										<span className="d-flex align-items-center gap-1 w-100">
											<span className={`text-${variant} d-flex`}>
												<MethodIcon method={event.method} size={11} />
											</span>
											<span className="font-monospace text-body-secondary">
												{formatTime(event.time)}
											</span>
										</span>
										<span className="d-block w-100 text-truncate fw-semibold">
											{event.title}
										</span>
									</button>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const AgendaView = ({ cursor, visibleEvents, onSelectEvent }) => {
	// A multi-day event belongs to the month if ANY of its days land in it, so
	// a trip that starts in March still shows up when browsing April.
	const monthEvents = visibleEvents.filter((event) =>
		eventDayKeys(event).some((key) => {
			const date = fromDay(key);
			return (
				date.getMonth() === cursor.getMonth() &&
				date.getFullYear() === cursor.getFullYear()
			);
		}),
	);

	const groups = [];
	monthEvents.forEach((event) => {
		const last = groups[groups.length - 1];
		if (last && last.day === event.day) last.items.push(event);
		else groups.push({ day: event.day, items: [event] });
	});

	if (groups.length === 0) {
		return (
			<div className="border rounded-2 p-5 text-center text-body-secondary">
				<CalendarOff size={28} aria-hidden="true" className="mb-2" />
				<p className="mb-0">
					No appointments match the current filters this month.
				</p>
			</div>
		);
	}

	return (
		<div className="border rounded-2 overflow-hidden">
			{groups.map((group) => (
				<div key={group.day}>
					<div className="bg-body-tertiary border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
						<span className="fw-semibold small">
							{longDayLabel(fromDay(group.day))}
						</span>
						<span className="text-body-secondary small font-monospace">
							{group.day}
						</span>
					</div>
					<table className="table table-hover table-responsive mb-0 align-middle">
						<tbody>
							{group.items.map((event) => (
								<tr key={event._id}>
									<td
										className="font-monospace text-body-secondary small"
										style={{ width: "6.5rem" }}
									>
										{event.allDay ? (
											<span
												className="text-uppercase"
												style={{ fontSize: "0.65rem" }}
											>
												All day
											</span>
										) : (
											formatTime(event.time)
										)}
									</td>
									<td>
										<div className="fw-semibold d-flex align-items-center gap-2">
											{event.title}
											{event.postType === "event" ? (
												<span
													className="badge text-bg-info text-uppercase"
													style={{ fontSize: "0.6rem" }}
												>
													Event
												</span>
											) : null}
											{isMultiDay(event) ? (
												<span className="text-body-secondary small fw-normal">
													{spanDays(event)} days · ends {event.endDay}
												</span>
											) : null}
										</div>
										<div
											className="text-body-secondary small text-truncate"
											style={{ maxWidth: "32rem" }}
										>
											{event.excerpt}
										</div>
									</td>
									<td className="small text-body-secondary text-nowrap">
										<span className="d-inline-flex align-items-center gap-1">
											<MethodIcon method={event.method} size={14} />
											{METHOD_LABELS[event.method]}
										</span>
									</td>
									<td className="small text-body-secondary text-nowrap">
										{(event.attendees || []).length} attending
									</td>
									<td className="text-nowrap">
										<span
											className={`badge text-bg-${
												PRIORITY_VARIANTS[event.priority]
											} me-1 text-uppercase`}
										>
											{event.priority}
										</span>
										<span
											className={`badge text-bg-${
												STATUS_VARIANTS[event.status]
											}`}
										>
											{event.status}
										</span>
									</td>
									<td className="small text-body-secondary text-nowrap">
										{recurrenceLabel(event.recurrenceRule)}
									</td>
									<td className="text-end">
										<button
											type="button"
											className="btn btn-secondary btn-sm"
											onClick={() => onSelectEvent(event)}
										>
											Open
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			))}
		</div>
	);
};

const UpcomingPanel = ({ visibleEvents, clock, onSelectEvent }) => {
	// String comparison against the shared clock snapshot, so this renders the
	// same on the server and on the client regardless of time zone.
	// A multi-day event counts as upcoming until its LAST day has passed, so a
	// trip already under way stays in the list instead of dropping off on day 2.
	const upcoming = visibleEvents.filter(
		(event) =>
			dayTimeStamp(
				event.endDay || event.day,
				event.allDay ? "23:59" : event.time,
			) >= clock.stamp,
	);
	const todayCount = visibleEvents.filter((event) =>
		eventDayKeys(event).includes(clock.today),
	).length;

	// Attendees belong to the series, not to each occurrence, so a weekly standup
	// with one unanswered invite must count once — not once per week on screen.
	const seenSeries = new Set();
	const awaiting = visibleEvents.reduce((total, event) => {
		const key = event.seriesId || event._id;
		if (seenSeries.has(key)) return total;
		seenSeries.add(key);
		return (
			total +
			(event.attendees || []).filter((person) => person.response === "pending")
				.length
		);
	}, 0);

	return (
		<div className="card h-100">
			<div className="card-header d-flex align-items-center justify-content-between">
				<span className="fw-semibold">Up next</span>
				<span className="d-flex gap-2">
					<span className={`badge text-bg-primary`} title="Appointments today">
						{todayCount} today
					</span>
					<span
						className={`badge bg-warning text-bg-warning`}
						title="Attendee responses still pending"
					>
						{awaiting} pending
					</span>
				</span>
			</div>

			{upcoming.length === 0 ? (
				<div className="card-body text-body-secondary small">
					Nothing scheduled ahead. Time to book something.
				</div>
			) : (
				<ul className="list-group list-group-flush">
					{upcoming.slice(0, 7).map((event) => (
						<li
							key={event._id}
							// action
							onClick={() => onSelectEvent(event)}
							className="list-group-item d-flex flex-column gap-1"
						>
							<span className="d-flex align-items-center gap-2 small text-body-secondary">
								<span
									className={`text-${PRIORITY_VARIANTS[event.priority]} d-flex`}
								>
									<MethodIcon method={event.method} size={13} />
								</span>
								<span className="font-monospace">{formatTime(event.time)}</span>
								<span className="text-truncate">
									{longDayLabel(fromDay(event.day))}
								</span>
							</span>
							<span className="fw-semibold text-truncate">{event.title}</span>
							<span className="small text-body-secondary text-truncate">
								{METHOD_LABELS[event.method]}
								{event.attendees && event.attendees.length
									? ` · ${event.attendees.length} attendee(s)`
									: ""}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

const EventDetailModal = ({
	event,
	onHide,
	onEdit,
	onTrash,
	onRestore,
	onRemove,
}) => {
	if (!event) return null;

	// Occurrences are virtual clones, so every write has to name the stored
	// document instead of the synthetic occurrence id.
	const seriesId = event.seriesId || event._id;
	const repeats = isRecurring(event.recurrenceRule);

	return (
		<Modal show={Boolean(event)} onHide={onHide} centered size="lg">
			<Modal.Header closeButton>
				<div>
					<div className="d-flex align-items-center gap-2 mb-1">
						<span
							className={`badge text-bg-${
								PRIORITY_VARIANTS[event.priority]
							} text-uppercase`}
						>
							{event.priority}
						</span>
						<span className={`badge text-bg-${STATUS_VARIANTS[event.status]}`}>
							{event.status}
						</span>
						<span className={`badge bg-light text-bg-dark text-uppercase`}>
							{POST_TYPE_LABELS[event.postType] || "Appointment"}
						</span>
						{event.allDay ? (
							<span className={`badge text-bg-secondary text-uppercase`}>
								All day
							</span>
						) : null}
						{repeats ? (
							<span
								className={`badge bg-info text-bg-dark d-inline-flex align-items-center gap-1`}
							>
								{/* <Repeat size={12} aria-hidden="true" /> */}
								<i className="fa-solid fa-repeat" aria-hidden="true" />
								Repeating
							</span>
						) : null}
						<span className="text-body-secondary small font-monospace">
							/{event.slug}
						</span>
					</div>
					<div className="modal-title h5 mb-0">{event.title}</div>
				</div>
			</Modal.Header>

			<div className="modal-body">
				<div className="d-flex flex-wrap gap-4 mb-3">
					<div>
						<div
							className="text-uppercase text-body-secondary"
							style={{ fontSize: "0.7rem" }}
						>
							When
						</div>
						<div className="d-flex align-items-center gap-2 flex-wrap">
							{/* <Clock size={14} aria-hidden="true" /> */}
							<i className="fa-regular fa-clock" aria-hidden="true" />
							<span>{longDayLabel(fromDay(event.day))}</span>
							{isMultiDay(event) ? (
								<>
									<span className="text-body-secondary">→</span>
									<span>{longDayLabel(fromDay(event.endDay))}</span>
									<span className="text-body-secondary small">
										({spanDays(event)} days)
									</span>
								</>
							) : null}
							{event.allDay ? (
								<span className="text-body-secondary small">All day</span>
							) : (
								<>
									<span className="font-monospace">
										{formatTime(event.time)}
									</span>
									<span className="text-body-secondary small">
										({event.durationMinutes} min)
									</span>
								</>
							)}
						</div>
					</div>
					<div>
						<div
							className="text-uppercase text-body-secondary"
							style={{ fontSize: "0.7rem" }}
						>
							Method
						</div>
						<div className="d-flex align-items-center gap-2">
							<MethodIcon method={event.method} size={14} />
							{METHOD_LABELS[event.method]}
						</div>
					</div>
					<div>
						<div
							className="text-uppercase text-body-secondary"
							style={{ fontSize: "0.7rem" }}
						>
							Recurrence
						</div>
						<div className="d-flex align-items-center gap-2">
							{/* <Repeat size={14} aria-hidden="true" /> */}
							<i className="fa-solid fa-repeat" aria-hidden="true" />
							{recurrenceLabel(event.recurrenceRule)}
						</div>
						{repeats ? (
							<div
								className="text-body-secondary"
								style={{ fontSize: "0.75rem" }}
							>
								{event.occurrenceTotal
									? `Occurrence ${(event.occurrenceIndex || 0) + 1} of ${
											event.occurrenceTotal
										}`
									: `Occurrence ${(event.occurrenceIndex || 0) + 1}`}
								{" · edits apply to the whole series"}
							</div>
						) : null}
					</div>
				</div>

				{event.location ? (
					<p className="d-flex align-items-center gap-2 mb-3">
						<MapPin size={14} aria-hidden="true" />
						<span className="text-body-secondary">{event.location}</span>
					</p>
				) : null}

				<p className="mb-3">{event.excerpt}</p>

				{event.text && event.text.body ? (
					<div className="bg-body-tertiary border rounded-2 p-3 mb-3">
						<div
							className="text-uppercase text-body-secondary mb-1"
							style={{ fontSize: "0.7rem" }}
						>
							Notes
						</div>
						<p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
							{event.text.body}
						</p>
					</div>
				) : null}

				{event.textEncrypted ? (
					<p className="d-flex align-items-center gap-2 text-body-secondary small mb-3">
						{/* <Lock size={13} aria-hidden="true" /> */}
						<i className="fa-solid fa-lock" aria-hidden="true" />
						Notes are stored encrypted by the API and cannot be read from the
						client.
					</p>
				) : null}

				<div
					className="text-uppercase text-body-secondary mb-2"
					style={{ fontSize: "0.7rem" }}
				>
					Attendees ({(event.attendees || []).length})
				</div>
				{(event.attendees || []).length === 0 ? (
					<p className="text-body-secondary small">Nobody invited yet.</p>
				) : (
					<ul className="list-group list-group-flush border rounded-2">
						{event.attendees.map((person, index) => (
							<li
								key={index}
								className="list-group-item d-flex align-items-center justify-content-between"
							>
								<span>
									<span className="fw-semibold">
										{person.name || "Unnamed"}
									</span>
									<span className="text-body-secondary small ms-2">
										{person.email}
									</span>
								</span>
								<span className="d-flex align-items-center gap-2">
									<span className="text-body-secondary small text-capitalize">
										{person.role}
									</span>
									<span
										className={`badge text-bg-${
											RESPONSE_VARIANTS[person.response] || "secondary"
										}`}
									>
										{person.response}
									</span>
								</span>
							</li>
						))}
					</ul>
				)}
				<div className="text-body-secondary small mt-3 font-monospace">
					fullCalendarDateFormat: {event.fullCalendarDateFormat}
				</div>
			</div>
			<div className="modal-footer justify-content-between">
				{event.status === "trash" ? (
					<span className="d-flex gap-2">
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => {
								onRestore(seriesId);
								onHide();
							}}
						>
							{/* <RotateCcw size={14} aria-hidden="true" className="me-1" /> */}
							<i className="fa-solid fa-rotate-left me-1" aria-hidden="true" />
							Restore
						</button>
						<button
							type="button"
							className="btn btn-outline-danger"
							onClick={() => {
								onRemove(seriesId);
								onHide();
							}}
						>
							{/* <Trash2 size={14} aria-hidden="true" className="me-1" /> */}
							<i class="fa-solid fa-trash-can me-1" aria-hidden="true" />
							Delete forever
						</button>
					</span>
				) : (
					<button
						type="button"
						className="btn btn-outline-danger"
						onClick={() => {
							onTrash(seriesId);
							onHide();
						}}
					>
						{/* <Trash2 size={14} aria-hidden="true" className="me-1" /> */}
						<i class="fa-solid fa-trash-can me-1" aria-hidden="true" />
						{repeats ? "Trash whole series" : "Move to trash"}
					</button>
				)}
				<span className="d-flex gap-2">
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={onHide}
					>
						Close
					</button>
					<button className="btn btn-primary" onClick={() => onEdit(event)}>
						Edit
					</button>
				</span>
			</div>
		</Modal>
	);
};

const EventFormModal = ({
	show,
	onHide,
	event,
	defaultDay,
	errorMessage,
	findBlocker,
	onError,
	onSaved,
}) => {
	/**
	 * The values the form opens with. Derived from props rather than copied into
	 * state, so the `defaultValue` of every uncontrolled field below is the
	 * current entry's value at the moment those fields mount.
	 */
	const seed = useMemo(
		() => (event ? toDraft(event) : blankDraft(defaultDay)),
		[event, defaultDay],
	);

	const [draft, setDraft] = useState(() => liveFrom(seed));
	const [attendeeRows, setAttendeeRows] = useState(() =>
		withRowIds(seed.attendees),
	);
	const [validated, setValidated] = useState(false);
	const [saving, setSaving] = useState(false);
	const [resetNonce, setResetNonce] = useState(0);

	/** Patches one field of the live draft. Uncontrolled fields never come
	 *  through here, so typing in them no longer re-renders the modal. */
	const set = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

	/**
	 * An uncontrolled input keeps whatever the DOM last held, and this one modal
	 * is reused for every entry, so the fields are remounted whenever the form
	 * should start over: a different entry, a different day, reopening, or
	 * Reset. Without this, opening the form on a new day would show the previous
	 * entry's values while `draft.day` already held the new one.
	 */
	const formKey = [
		show ? "open" : "shut",
		event ? event._id : "new",
		defaultDay,
		resetNonce,
	].join(":");

	const resetForm = () => {
		setValidated(false);
		onError("");
		setDraft(liveFrom(seed));
		setAttendeeRows(withRowIds(seed.attendees));
		// State alone is no longer enough — the uncontrolled fields only pick up
		// their defaults again when the remount happens.
		setResetNonce((n) => n + 1);
	};

	useEffect(() => {
		if (!show) return;
		setValidated(false);
		setSaving(false);
		setDraft(liveFrom(seed));
		setAttendeeRows(withRowIds(seed.attendees));
	}, [show, seed]);

	/**
	 * Switching to `appointment` drops the end day, because only an event may
	 * span days. Keeping it would let a stale range reach the API.
	 */
	const setPostType = (value) =>
		setDraft((prev) => ({
			...prev,
			postType: value,
			endDay: value === "event" ? prev.endDay : "",
		}));

	const isEvent = draft.postType === "event";
	const multiDay = isEvent && Boolean(draft.endDay);

	// `<input type="date">` cannot express "after this other field", so the
	// range is checked here and surfaced as a normal invalid-feedback message.
	const endDayError =
		multiDay && dayDiff(draft.day, draft.endDay) < 1
			? "The end day must come after the start day."
			: "";

	/*
	 * The date fields are freely editable, so a day that was available when the
	 * form opened can still be swapped for a fully-occupied one. Every day the
	 * entry would cover is checked, which also stops a multi-day event from being
	 * stretched across an existing all-day entry.
	 */
	const occupiedDays =
		multiDay && !endDayError ? dayRange(draft.day, draft.endDay) : [draft.day];
	// Keeps the clashing day alongside the blocker: the blocker's own `day` is
	// the start of its span, which is not necessarily the day that clashes.
	const dayClash = findBlocker
		? occupiedDays
				.map((day) => ({ day, blocker: findBlocker(day, event && event._id) }))
				.find((entry) => entry.blocker) || null
		: null;
	const dayBlockedError = dayClash
		? `“${dayClash.blocker.title}” already takes all of ${dayClash.day}, so nothing else can be booked then.`
		: "";

	/* --- recurrence --- */

	const setRecurrence = (patch) =>
		setDraft((prev) => ({
			...prev,
			recurrenceRule: { ...prev.recurrenceRule, ...patch },
		}));

	const repeats = FREQUENCIES.includes(draft.recurrenceRule.freq);
	const intervalUnit = `${
		RECURRENCE_UNITS[draft.recurrenceRule.freq] || "day"
	}${Number(draft.recurrenceRule.interval) > 1 ? "s" : ""}`;

	// COUNT and UNTIL are mutually exclusive, so the mode is derived from
	// whichever one is filled in rather than tracked as separate state that
	// could drift out of sync with the rule.
	const endsMode = draft.recurrenceRule.count
		? "after"
		: draft.recurrenceRule.until
			? "on"
			: "never";

	const setEndsMode = (mode) => {
		if (mode === "after") setRecurrence({ count: 10, until: "" });
		else if (mode === "on")
			setRecurrence({
				count: "",
				until: draft.recurrenceRule.until || draft.day,
			});
		else setRecurrence({ count: "", until: "" });
	};

	const untilError =
		endsMode === "on" &&
		draft.recurrenceRule.until &&
		dayDiff(draft.day, draft.recurrenceRule.until) < 0
			? "The end date must be on or after the start day."
			: "";

	// Preview is generated by the same engine that renders the calendar, so what
	// the form promises and what the grid draws can never disagree.
	const previewRule = repeats
		? {
				freq: draft.recurrenceRule.freq,
				interval: Number(draft.recurrenceRule.interval) || 1,
				...(draft.recurrenceRule.count
					? { count: Number(draft.recurrenceRule.count) }
					: {}),
				...(draft.recurrenceRule.until && !draft.recurrenceRule.count
					? { until: draft.recurrenceRule.until }
					: {}),
			}
		: {};

	const previewDays = repeats
		? expandRecurrence(
				{ ...draft, _id: "preview", recurrenceRule: previewRule },
				draft.day,
				toDay(addDays(fromDay(draft.day), 400)),
			).map((item) => item.day)
		: [];

	// A span longer than the gap between occurrences would make the series
	// overlap itself, which is almost never what someone means.
	const stepDays =
		draft.recurrenceRule.freq === "daily"
			? Number(draft.recurrenceRule.interval) || 1
			: draft.recurrenceRule.freq === "weekly"
				? 7 * (Number(draft.recurrenceRule.interval) || 1)
				: 28 * (Number(draft.recurrenceRule.interval) || 1);
	const overlapWarning =
		repeats &&
		multiDay &&
		!endDayError &&
		dayDiff(draft.day, draft.endDay) + 1 > stepDays
			? "This event lasts longer than the gap between repeats, so occurrences will overlap."
			: "";

	const addAppointment = async (e) => {
		e.preventDefault();
		const form = e.currentTarget;

		// `dayBlockedError` is deliberately NOT part of this gate. It is a hint
		// derived from the days currently on screen, and the server owns the real
		// decision — gating on it here would refuse a booking the API would allow
		// (and could never catch one it would refuse).
		if (!form.checkValidity() || endDayError || untilError) {
			setValidated(true);
			return;
		}

		setSaving(true);
		onError("");

		// One read of the form covers every field, including the ones still held
		// in state: a controlled input serializes into FormData just like an
		// uncontrolled one, so the payload does not have to care which is which.
		const data = new FormData(form);
		const str = (name) => String(data.get(name) ?? "");
		const trimmed = (name) => str(name).trim();

		// `getAll` returns the rows in the order they are rendered, so the columns
		// of a row line up by index. A row left entirely blank is dropped instead
		// of being saved as an empty attendee.
		const emails = data.getAll("attendee-email");
		const phones = data.getAll("attendee-phone");
		const roles = data.getAll("attendee-role");
		const responses = data.getAll("attendee-response");
		const attendees = data
			.getAll("attendee-name")
			.map((name, i) => ({
				name: String(name).trim(),
				email: String(emails[i] ?? "").trim(),
				phoneNumber: String(phones[i] ?? "").trim(),
				role: String(roles[i] ?? "guest"),
				response: String(responses[i] ?? "pending"),
			}))
			.filter((person) => person.name || person.email || person.phoneNumber);

		// An unchecked box is absent from FormData and a checked one arrives as
		// the string "on", so neither case is the boolean the API expects.
		const allDay = data.get("allDay") === "on";
		// `type="date"` submits YYYY-MM-DD, which is not the format the rest of
		// the calendar uses, so it goes back through the same parser as the input.
		const endDayValue = str("endDay");

		const payload = {
			title: trimmed("title"),
			excerpt: trimmed("excerpt"),
			text: str("text"),
			postType: str("postType"),
			allDay,
			day: dayToIso(fromInputDate(str("day"))),
			endDay:
				isEvent && endDayValue ? dayToIso(fromInputDate(endDayValue)) : "",
			// The time and duration inputs are not rendered for an all-day entry, so
			// there is nothing to read and the fixed values are used instead.
			time: allDay ? "00:00" : str("time"),
			durationMinutes: allDay ? 0 : Number(data.get("durationMinutes")) || 30,
			method: str("method"),
			address: trimmed("address"),
			priority: str("priority"),
			status: str("status"),
			attendees,
			// `previewRule` is already the normalized rule the preview was built
			// from, so saving it guarantees the series matches what was shown.
			recurrenceRule: previewRule,
		};

		const result = event
			? await updateEventRequest(event._id, payload)
			: await createEventRequest(payload);

		setSaving(false);

		if (!result.ok) {
			// Shown inline as well as toasted: the modal covers the toast region.
			onError(result.message);
			toast.error(result.message);
			return;
		}

		toast.success(isEvent ? "Event created" : "Appointment created");
		onHide();
		if (onSaved) onSaved();
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			size="xl"
			backdrop={true}
			animation={true}
		>
			<form key={formKey} onSubmit={addAppointment}>
				<Modal.Header closeButton>
					<div className="modal-title h5">
						{event ? "Edit" : "New"} {isEvent ? "event" : "appointment"}
					</div>
				</Modal.Header>
				<div className="modal-body">
					{/*
            Kept as an inline Alert rather than a toast. The modal covers the
            toast region, and a save failure has to stay visible next to the
            fields the user is about to correct.
          */}
					{errorMessage ? (
						<Alert variant="danger" className="py-2 small mb-3">
							{errorMessage}
						</Alert>
					) : null}

					<div className="row g-3">
						<div className="col-xs-12">
							<label htmlFor="title" className="form-label">
								Title
							</label>
							<input
								id="title"
								name="title"
								defaultValue={seed.title}
								type="text"
								className="form-control"
								placeholder="Discovery call - Acme Co."
								required={true}
							/>
							<Form.Control.Feedback type="invalid">
								Please add a title.
							</Form.Control.Feedback>
						</div>
						{/* Entry type drives which date and time fields make sense below. */}
						<div className="col-xs-12">
							<label className="form-label d-block">Type</label>
							{/* The type is a button group rather than an input, so a hidden
                  field is what carries it into FormData with everything else. */}
							<input type="hidden" name="postType" value={draft.postType} />
							<div className="d-flex flex-wrap align-items-center gap-3">
								<div
									className="btn-group btn-group-sm"
									role="group"
									aria-label="Entry type"
								>
									{POST_TYPES.map((type) => (
										<button
											key={type}
											type="button"
											className={`btn btn-${
												draft.postType === type
													? "primary"
													: "outline-secondary"
											}`}
											onClick={() => setPostType(type)}
											aria-pressed={draft.postType === type}
										>
											{type === "event" ? (
												<CalendarRange
													size={14}
													aria-hidden="true"
													className="me-1"
												/>
											) : (
												<CalendarClock
													size={14}
													aria-hidden="true"
													className="me-1"
												/>
											)}
											{POST_TYPE_LABELS[type]}
										</button>
									))}
								</div>
								<Form.Check
									id="allDay"
									name="allDay"
									type="switch"
									label="All day"
									checked={draft.allDay}
									onChange={(e) => set("allDay", e.target.checked)}
								/>
							</div>
							<div id="" className="form-text text-body-secondary">
								{POST_TYPE_HINTS[draft.postType]}
							</div>
						</div>
						<div className={isEvent ? "col-md-4" : "col-md-6"}>
							<label htmlFor="event-day" className="form-label">
								{isEvent ? "Starts" : "Day"}
							</label>
							{/* `isInvalid` is a react-bootstrap prop; on a raw input React
                  forwards it to the DOM and warns. The class does the job. */}
							<input
								id="event-day"
								name="day"
								value={toInputDate(draft.day)}
								onChange={(e) => set("day", fromInputDate(e.target.value))}
								aria-describedby="event-day-help"
								type="date"
								className={`form-control${dayBlockedError ? " is-invalid" : ""}`}
								required={true}
							/>
							<Form.Control.Feedback type="invalid">
								{dayBlockedError}
							</Form.Control.Feedback>
							{!dayBlockedError ? (
								<div
									id="event-day-help"
									className="form-text text-body-secondary font-monospace"
								>
									{draft.day}
								</div>
							) : null}
						</div>

						{/* Only an event can run past a single day. */}
						{isEvent ? (
							<div className="col-md-4">
								<label htmlFor="event-end-day" className="form-label">
									Ends
								</label>
								<input
									id="event-end-day"
									name="endDay"
									value={draft.endDay ? toInputDate(draft.endDay) : ""}
									onChange={(e) =>
										set(
											"endDay",
											e.target.value ? fromInputDate(e.target.value) : "",
										)
									}
									type="date"
									className={`form-control${
										validated && endDayError ? " is-invalid" : ""
									}`}
									min={toInputDate(draft.day)}
								/>
								<Form.Control.Feedback type="invalid">
									{endDayError}
								</Form.Control.Feedback>
								{!endDayError ? (
									<div className="form-text text-body-secondary">
										{multiDay
											? `Spans ${dayDiff(draft.day, draft.endDay) + 1} days`
											: "Leave empty for a single-day event"}
									</div>
								) : null}
							</div>
						) : null}

						{/*
						 * An all-day entry has no start time or duration, so the inputs are
						 * replaced by a short explanation rather than left there disabled.
						 */}
						{draft.allDay ? (
							<div
								className={`${
									isEvent ? "col-md-4" : "col-md-6"
								} d-flex align-items-end`}
							>
								<p className="text-body-secondary small mb-0">
									{multiDay
										? "Runs for the whole of every day in the range."
										: "Occupies the whole day — no start time needed."}
								</p>
							</div>
						) : (
							<>
								<div className={isEvent ? "col-md-2" : "col-md-3"}>
									<label htmlFor="time" className="form-label">
										Time
									</label>
									<input
										id="time"
										name="time"
										value={draft.time}
										onChange={(e) => set("time", e.target.value)}
										type="time"
										className="form-control"
										placeholder=""
										required={true}
									/>
								</div>
								<div className={isEvent ? "col-md-2" : "col-md-3"}>
									<label htmlFor="duration" className="form-label">
										Duration
									</label>
									<select
										id="duration"
										name="durationMinutes"
										value={draft.durationMinutes}
										onChange={(e) => set("durationMinutes", e.target.value)}
										className="form-select"
									>
										{[15, 25, 30, 45, 60, 90, 120].map((minutes) => (
											<option key={minutes} value={minutes}>
												{minutes} min
											</option>
										))}
									</select>
								</div>
							</>
						)}
						<div className="col-md-4">
							<label htmlFor="method" className="form-label">
								Method
							</label>
							<select
								id="method"
								name="method"
								value={draft.method}
								onChange={(e) => set("method", e.target.value)}
								className="form-select"
							>
								{METHODS.map((method) => (
									<option key={method} value={method}>
										{METHOD_LABELS[method]}
									</option>
								))}
							</select>
						</div>
						<div className="col-md-4">
							<label htmlFor="priority" className="form-label">
								Priority
							</label>
							<select
								id="priority"
								name="priority"
								defaultValue={seed.priority}
								className="form-select"
							>
								{PRIORITIES.map((priority) => (
									<option key={priority} value={priority}>
										{priority}
									</option>
								))}
							</select>
						</div>
						<div className="col-md-4">
							<label htmlFor="status" className="form-label">
								Status
							</label>
							<select
								id="status"
								name="status"
								defaultValue={seed.status}
								className="form-select"
							>
								{STATUSES.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>

						<div className="col-xs-12">
							{/* This used to reuse id/name "method", which collided with the
                  Method select above it: the label pointed at the wrong
                  control and FormData never carried an address at all. */}
							<label htmlFor="event-location" className="form-label">
								{draft.method === "phone"
									? "Phone number"
									: draft.method === "video-interview"
										? "Meeting link"
										: "Address"}
							</label>
							<input
								id="event-location"
								name="address"
								defaultValue={seed.location}
								type="text"
								className="form-control"
								placeholder={
									draft.method === "phone"
										? "+1 (555) 010-0000"
										: draft.method === "video-interview"
											? "meet.example.com/room"
											: "123 Main St, Suite 400"
								}
							/>
						</div>
						<div className="col-xs-12">
							<label htmlFor="excerpt" className="form-label">
								Excerpt
							</label>
							<input
								id="excerpt"
								name="excerpt"
								defaultValue={seed.excerpt}
								type="text"
								className="form-control"
								placeholder="One line summary shown in lists"
							/>
						</div>
						<div className="col-xs-12">
							<label htmlFor="text" className="form-label">
								Notes
							</label>
							<textarea
								id="text"
								name="text"
								defaultValue={seed.body}
								className="form-control"
								placeholder="Agenda, context, prep work…"
								rows="5"
							/>

							<div className="form-text text-body-secondary">
								Stored in the schema&apos;s <code>text</code> object as{" "}
								<code>{"{ body }"}</code>.
							</div>
						</div>
						<div className="col-xs-12">
							<hr className="my-1" />
							<div className="d-flex align-items-center justify-content-between mb-2">
								<span className="fw-semibold">Attendees</span>
								<button
									type="button"
									className="btn btn-outline-primary btn-sm"
									onClick={() =>
										setAttendeeRows((prev) => [
											...prev,
											...withRowIds([attendee("", "", "guest", "pending")]),
										])
									}
								>
									{/* <Plus size={14} aria-hidden="true" className="me-1" /> */}
									<i className="fa-solid fa-plus me-1" aria-hidden="true" />
									Add attendee
								</button>
							</div>
							{attendeeRows.length === 0 ? (
								<p className="text-body-secondary small mb-0">
									No attendees yet.
								</p>
							) : (
								attendeeRows.map((person, index) => (
									<div
										className="row g-2 mb-2 align-items-center"
										key={person.rowId}
									>
										{/* These four inputs are read with `getAll`, so every row
                        repeats the same names on purpose. `role` is not
                        editable here but still has to survive the round trip,
                        which is what the hidden field is for. */}
										<input
											type="hidden"
											name="attendee-role"
											defaultValue={person.role || "guest"}
										/>
										<div className="col-md-3">
											<input
												name="attendee-name"
												defaultValue={person.name}
												type="text"
												className="form-control form-control-sm"
												placeholder="Name"
												aria-label={`Attendee ${index + 1} name`}
											/>
										</div>
										<div className="col-md-4">
											<input
												name="attendee-email"
												defaultValue={person.email}
												type="email"
												className="form-control form-control-sm"
												placeholder="email@example.com"
												aria-label={`Attendee ${index + 1} email`}
											/>
										</div>
										<div className="col-md-2">
											<input
												name="attendee-phone"
												defaultValue={person.phoneNumber}
												type="tel"
												className="form-control form-control-sm"
												placeholder="555-000-0000"
												aria-label={`Attendee ${index + 1} phone number`}
											/>
										</div>
										<div className="col-md-2">
											<select
												name="attendee-response"
												defaultValue={person.response}
												className="form-select form-select-sm"
												aria-label={`Attendee ${index + 1} response`}
											>
												<option value="pending">pending</option>
												<option value="accepted">accepted</option>
												<option value="declined">declined</option>
											</select>
										</div>
										<div className="col-md-1 text-end">
											<button
												type="button"
												className="btn btn-outline-danger btn-sm"
												aria-label={`Remove attendee ${index + 1}`}
												onClick={() =>
													setAttendeeRows((prev) =>
														prev.filter((row) => row.rowId !== person.rowId),
													)
												}
											>
												<i
													className="fa-solid fa-trash-can"
													aria-hidden="true"
												/>
											</button>
										</div>
									</div>
								))
							)}
						</div>
						<div className="col-xs-12">
							<hr className="my-1" />
							<span className="fw-semibold d-block mb-2">Recurrence</span>
							<div className="row g-2 align-items-end">
								<div className="col-md-4">
									<label
										htmlFor="repeat-freq"
										className="form-label small mb-1"
									>
										Repeats
									</label>
									<select
										id="repeat-freq"
										name="repeat-freq"
										defaultValue={draft.recurrenceRule.freq}
										// value={draft.recurrenceRule.freq}
										// onChange={(e) => setRecurrence({ freq: e.target.value })}
										className="form-select"
									>
										<option value="">Does not repeat</option>
										{FREQUENCIES.map((freq) => (
											<option key={freq} value={freq}>
												{FREQUENCY_LABELS[freq]}
											</option>
										))}
									</select>
								</div>
								{repeats ? (
									<>
										<div className="col-md-4">
											<label
												htmlFor="repeat-interval"
												className="form-label small mb-1"
											>
												Every
											</label>
											<div className="input-group">
												<input
													id="repeat-interval"
													name="repeat-interval"
													defaultValue={draft.recurrenceRule.interval}
													// value={draft.recurrenceRule.interval}
													// onChange={(e) =>
													// 	setRecurrence({ interval: e.target.value })
													// }
													type="number"
													min="1"
													max="99"
												/>
												<span className="input-group-text">{intervalUnit}</span>
											</div>
										</div>
										<div className="col-md-4">
											<label
												htmlFor="repeat-ends"
												className="form-label small mb-1"
											>
												Ends
											</label>
											<select
												id="repeat-ends"
												name="repeat-ends"
												defaultValue={endsMode}
												// value={endsMode}
												// onChange={(e) => setEndsMode(e.target.value)}
												className="form-select"
											>
												<option value="never">Never</option>
												<option value="after">After a number of times</option>
												<option value="on">On a date</option>
											</select>
										</div>
										{endsMode === "after" ? (
											<div className="col-md-4">
												<label
													htmlFor="repeat-count"
													className="form-label small mb-1"
												>
													Number of occurrences
												</label>
												<input
													id="repeat-count"
													name="repeat-count"
													defaultValue={draft.recurrenceRule.count}
													// value={draft.recurrenceRule.count}
													// onChange={(e) =>
													// 	setRecurrence({ count: e.target.value, until: "" })
													// }
													type="number"
													min="2"
													max={MAX_OCCURRENCES}
												/>
												<div className="form-text text-body-secondary">
													Counts the first one.
												</div>
											</div>
										) : null}
										{endsMode === "on" ? (
											<div className="col-md-4">
												<label
													htmlFor="repeat-until"
													className="form-label small mb-1"
												>
													Repeat until
												</label>
												<input
													id="repeat-until"
													name="repeat-until"
													defaultValue={
														draft.recurrenceRule.until
															? dayToIso(draft.recurrenceRule.until)
															: ""
													}
													// value={
													// 	draft.recurrenceRule.until
													// 		? dayToIso(draft.recurrenceRule.until)
													// 		: ""
													// }
													// onChange={(e) =>
													// 	setRecurrence({
													// 		until: e.target.value
													// 			? isoToDay(e.target.value)
													// 			: "",
													// 		count: "",
													// 	})
													// }
													type="date"
													min={dayToIso(draft.day)}
													isInvalid={Boolean(untilError)}
												/>
												<Form.Control.Feedback type="invalid">
													{untilError}
												</Form.Control.Feedback>
											</div>
										) : null}
										<div className="col-xs-12">
											<div className="d-flex align-items-center gap-2 small text-body-secondary mt-1">
												{/* <Repeat size={14} aria-hidden="true" /> */}
												<i className="fa-solid fa-repeat" aria-hidden="true" />
												<span>
													{recurrenceLabel(previewRule)}
													{previewDays.length > 1
														? ` — next: ${previewDays.slice(1, 4).join(", ")}`
														: ""}
												</span>
											</div>
											{overlapWarning ? (
												<div className="small text-warning-emphasis mt-1">
													{overlapWarning}
												</div>
											) : null}
										</div>
									</>
								) : null}
							</div>
						</div>
					</div>
				</div>
				<div className="modal-footer justify-content-between">
					<span className="small text-body-secondary">
						<span className="badge text-bg-secondary me-2">
							fullCalendarDateFormat
						</span>
						<code>{toFullCalendarFormat(draft.day, draft.time)}</code>
					</span>
					<span className="d-flex gap-2">
						{/* <button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={onHide}
							disabled={saving}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary btn-sm"
							disabled={saving || Boolean(dayBlockedError)}
						>
							{saving ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										className="me-2"
										aria-hidden="true"
									/>
									Posting…
								</>
							) : editing ? (
								"Save changes"
							) : isEvent ? (
								"Create event"
							) : (
								"Create appointment"
							)}
						</button> */}
						{/* `disabled` deliberately ignores `dayBlockedError`: that hint is
                derived from the days currently on screen and can be stale, so
                gating the button on it would block a booking the API allows. */}
						<FormButtons
							classList=""
							variant="primary"
							pending={saving}
							pendingLabel="Posting…"
							label={
								event
									? "Save changes"
									: isEvent
										? "Create event"
										: "Create appointment"
							}
							onReset={resetForm}
						/>
					</span>
				</div>
			</form>
		</Modal>
	);
};

// ---------------------------------------------------------------------------
// 8. Scheduler — owns every piece of state
// ---------------------------------------------------------------------------

const Scheduler = ({
	objects = [],
	loadError,
	clock: serverSnapshot,
	initialAvailability,
}) => {
	const router = useRouter();

	/**
	 * Occupancy comes from the API, not from expanding recurrence in the browser.
	 * `blockedDays` / `blockerFor` keep the exact shapes the views already
	 * consumed, so nothing downstream of `viewProps` had to change.
	 */
	const {
		blockedDays,
		blockerFor,
		loadFor,
		refresh: refreshAvailability,
		error: availabilityError,
	} = useAvailability(initialAvailability);

	// The server resolves "today" and passes it in, so the first client render
	// produces identical markup. Reading the real clock during render instead
	// would break hydration whenever the two are in different time zones.
	const fallbackClock = serverSnapshot || { today: "", stamp: "" };
	const [clock, setClock] = useState(fallbackClock);

	const normalizedData = useMemo(
		() => (Array.isArray(objects.data) ? objects.data : []).map(normalizeEvent),
		[objects.data],
	);

	// --- data state ---
	const [events, setEvents] = useState(normalizedData || []);
	const [filters, setFilters] = useState(DEFAULT_FILTERS);
	// The entry with a write in flight, so its pill can show as busy. Covers
	// reschedule, trash, restore and delete, since none of them apply locally.
	const [pendingId, setPendingId] = useState(null);

	// Latest `forceMove`, read by the conflict toast's retry button.
	const forceMoveRef = useRef(null);

	// Id of the conflict prompt currently on screen, so the next attempt can
	// replace it instead of stacking a second, contradictory prompt.
	const conflictToastRef = useRef(null);

	// The create form keeps its own copy of the last failure so the reason stays
	// visible next to the fields while the toast is dismissed or times out.
	const [formError, setFormError] = useState("");

	// --- ui state ---
	const [view, setView] = useState("month");
	const [cursor, setCursor] = useState(() => fromDay(fallbackClock.today));
	const [selected, setSelected] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [defaultDay, setDefaultDay] = useState(fallbackClock.today);

	// Once mounted we are free to trust the browser's own clock.
	useEffect(() => {
		const local = serverClock();
		setClock((prev) =>
			prev.today === local.today && prev.stamp === local.stamp ? prev : local,
		);
	}, []);

	// Re-sync whenever the server component refetches.
	const serverSignature = useMemo(
		() =>
			(normalizedData || [])
				.map(
					(item) =>
						`${item._id}:${item.updatedAt || ""}:${item.day}:${item.time}:${
							item.status
						}`,
				)
				.join("|"),
		[normalizedData],
	);

	const syncedSignature = useRef(serverSignature);

	useEffect(() => {
		if (syncedSignature.current === serverSignature) return;
		syncedSignature.current = serverSignature;
		setEvents(normalizedData || []);
	}, [serverSignature, normalizedData]);

	/**
	 * Every write goes through here, and none of them touch `events` directly.
	 * The action is awaited first; only a confirmed success triggers a refetch,
	 * and the sync effect above is what actually adopts the new list. That makes
	 * the server the single source of truth — a refused write leaves the screen
	 * exactly as it was, so nothing can linger that the API never accepted.
	 *
	 * The trade-off is a visible round trip, which `pendingId` covers by marking
	 * the affected entry as busy while the request is in flight.
	 */
	const runWrite = useCallback(
		async (id, action, { notify, failure }) => {
			if (!events.some((item) => item._id === id)) {
				return {
					ok: false,
					message: "That entry is no longer on the calendar.",
				};
			}

			setPendingId(id);
			const result = await action(id);
			setPendingId(null);

			if (!result.ok) {
				toast.error(result.message || failure);
				return result;
			}

			notify();
			// Status changes free up or re-occupy the day, so occupancy is refetched
			// alongside the list rather than assumed to be unchanged.
			await refreshAvailability();
			router.refresh();
			return result;
		},
		[events, refreshAvailability, router],
	);

	const trashEvent = useCallback(
		(id) =>
			runWrite(id, trashEventRequest, {
				notify: () => toast.info("Moved to trash"),
				failure: "Could not move that to trash.",
			}),
		[runWrite],
	);

	const restoreEvent = useCallback(
		(id) =>
			runWrite(id, restoreEventRequest, {
				notify: () => toast.success("Restored"),
				failure: "Could not restore that.",
			}),
		[runWrite],
	);

	const removeEvent = useCallback(
		(id) =>
			runWrite(id, deleteEventRequest, {
				notify: () => toast.info("Deleted permanently"),
				failure: "Could not delete that.",
			}),
		[runWrite],
	);

	/**
	 * Drag and drop in the month and week grids.
	 * Moves the pill immediately, then PUTs to /admin/events/:id/reschedule and
	 * rolls the pill back to its original day if the API refuses.
	 */
	const moveEvent = useCallback(
		async (id, day, options) => {
			const target = events.find((item) => item._id === id);

			// A virtual occurrence has no document of its own, so there is nothing to
			// PUT. Pills for those are rendered non-draggable; this is the backstop.
			if (!target) {
				toast.info(
					"That is a repeat of a series. Drag the first occurrence to shift the whole series.",
				);
				return { ok: false, changed: false };
			}
			if (target.day === day) return { ok: true, changed: false };

			// The pill stays on its current day, marked pending, until the API
			// confirms the move. Nothing is recomputed locally — for a spanning entry
			// the server owns the new end day, so the refetch below is what shifts
			// the block rather than a guess made here.
			setPendingId(id);

			// Clear any stale conflict prompt, so "move anyway" can never be applied
			// to a previous, different attempt. The id is tracked per attempt rather
			// than fixed: re-adding a toast under an id that is still unmounting is
			// silently dropped, which left a repeat conflict with no feedback at all.
			if (conflictToastRef.current !== null) {
				toast.dismiss(conflictToastRef.current);
				conflictToastRef.current = null;
			}

			const result = await rescheduleEventRequest({
				id,
				day: dayToIso(day),
				force: Boolean(options && options.force),
				allowPast: Boolean(options && options.allowPast),
			});

			setPendingId(null);

			if (!result.ok) {
				// Nothing to undo — the move was never applied locally.
				// A conflict is recoverable, so it gets an override affordance instead
				// of a plain error. `forceMoveRef` breaks the circular dependency
				// between this callback and the one that retries through it.
				if (result.conflict) {
					conflictToastRef.current = toast.warning(
						`${result.message} Click here to move it anyway.`,
						{
							autoClose: 12000,
							onClick: () => forceMoveRef.current(id, day),
						},
					);
				} else {
					toast.error(result.message);
				}
				return result;
			}

			toast.success(`Moved to ${day}.`);
			// The occupancy map moved with it, so the blocked days are now stale.
			await refreshAvailability();
			router.refresh();
			return result;
		},
		[events, router, refreshAvailability],
	);

	/** Re-issues a move that came back as a 409 conflict, overriding the clash. */
	const forceMove = useCallback(
		(id, day) => moveEvent(id, day, { force: true, allowPast: true }),
		[moveEvent],
	);

	useEffect(() => {
		forceMoveRef.current = forceMove;
	}, [forceMove]);

	// Now that the calendar reads only from the API, both failures have to be
	// visible. A failed list would otherwise look like an ordinary empty month,
	// and failed availability would show every day as free and invite a booking
	// the server will refuse. Each is pinned to a fixed toast id so a repeated
	// failure replaces the prompt instead of stacking copies of it.
	useEffect(() => {
		if (!loadError) {
			toast.dismiss(LOAD_ERROR_TOAST_ID);
			return;
		}
		toast.warning(`Could not load events. ${loadError}`, {
			toastId: LOAD_ERROR_TOAST_ID,
			autoClose: false,
		});
	}, [loadError]);

	useEffect(() => {
		if (!availabilityError) {
			toast.dismiss(AVAILABILITY_ERROR_TOAST_ID);
			return;
		}
		toast.warning(availabilityError, {
			toastId: AVAILABILITY_ERROR_TOAST_ID,
			autoClose: false,
		});
	}, [availabilityError]);

	const visibleEvents = useMemo(() => {
		const term = filters.search.trim().toLowerCase();
		return events
			.filter((item) => {
				if (filters.hideTrash && item.status === "trash") return false;
				if (filters.method !== "all" && item.method !== filters.method)
					return false;
				if (filters.priority !== "all" && item.priority !== filters.priority)
					return false;
				if (filters.status !== "all" && item.status !== filters.status)
					return false;
				if (!term) return true;
				const haystack = [
					item.title,
					item.excerpt,
					item.location,
					...(item.attendees || []).map(
						(person) => `${person.name} ${person.email}`,
					),
				]
					.join(" ")
					.toLowerCase();
				return haystack.includes(term);
			})
			.sort((a, b) => toDateTime(a.day, a.time) - toDateTime(b.day, b.time));
	}, [events, filters]);

	const viewWindow = useMemo(() => {
		const anchor =
			view === "week"
				? startOfWeek(cursor)
				: startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
		const length = view === "week" ? 7 : 42;
		return {
			start: toDay(addDays(anchor, -7)),
			end: toDay(addDays(anchor, length + 7)),
		};
	}, [cursor, view]);

	const occurrences = useMemo(
		() =>
			expandAll(visibleEvents, viewWindow.start, viewWindow.end).sort(
				(a, b) => toDateTime(a.day, a.time) - toDateTime(b.day, b.time),
			),
		[visibleEvents, viewWindow],
	);

	const eventsByDay = useMemo(() => {
		const map = {};
		occurrences.forEach((item) => {
			eventDayKeys(item).forEach((key) => {
				if (!map[key]) map[key] = [];
				map[key].push(item);
			});
		});
		// All-day and spanning entries read best pinned above the timed ones.
		Object.keys(map).forEach((key) => {
			map[key].sort((a, b) => {
				const aBand = a.allDay || isMultiDay(a) ? 0 : 1;
				const bBand = b.allDay || isMultiDay(b) ? 0 : 1;
				if (aBand !== bBand) return aBand - bBand;
				return a.time.localeCompare(b.time);
			});
		});
		return map;
	}, [occurrences]);

	// --- ui handlers ---

	// The visible window only ever changes from a user action, so availability is
	// requested from these handlers rather than from an effect on `cursor`.
	const goTo = (next) => {
		setCursor(next);
		loadFor(next, view);
	};

	const step = (direction) => {
		const next =
			view === "week"
				? addDays(cursor, 7 * direction)
				: addMonths(cursor, direction);
		goTo(next);
	};

	const changeView = (next) => {
		setView(next);
		loadFor(cursor, next);
	};

	const openCreate = (day) => {
		const target = day || clock.today;
		const blocker = blockerFor(target);
		if (blocker) {
			toast.warning(
				`${blocker.title} already takes all of ${target}, so nothing else can be booked now.`,
			);
			return;
		}
		setEditing(null);
		setFormError("");
		setDefaultDay(target);
		setFormOpen(true);
	};

	const openEdit = (event) => {
		setSelected(null);
		setFormError("");
		const seriesId = event.seriesId || event._id;
		setEditing(events.find((item) => item._id === seriesId) || event);
		setFormOpen(true);
	};

	const viewProps = {
		cursor,
		todayKey: clock.today,
		eventsByDay,
		blockedDays,
		pendingId,
		onMove: moveEvent,
		onSelectEvent: setSelected,
		onCreateAt: openCreate,
	};

	return (
		<>
			<div className="container-fluid px-3 px-lg-4 py-4">
				<div className="row g-4">
					<div className="col-xl-9">
						<div className="card">
							<div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
								<div className="d-flex align-items-center gap-2">
									<div className="btn-group btn-group-sm" role="group">
										<button
											type="button"
											className="btn btn-outline-secondary"
											onClick={() => step(-1)}
											aria-label="Previous period"
										>
											<i
												className="fa-solid fa-chevron-left"
												aria-hidden="true"
											/>
										</button>
										<button
											type="button"
											className="btn btn-outline-secondary"
											onClick={() => goTo(fromDay(clock.today))}
										>
											Today
										</button>
										<button
											type="button"
											className="btn btn-outline-secondary"
											onClick={() => step(1)}
											aria-label="Next period"
										>
											<i
												className="fa-solid fa-chevron-right"
												aria-hidden="true"
											/>
										</button>
									</div>
									<h1 className="h5 mb-0 ms-2">
										{view === "week" ? weekLabel(cursor) : monthLabel(cursor)}
									</h1>
								</div>
								{/* The view switcher and the two actions share a wrapper so
                    they stay together on the right and wrap as one unit
                    against the period nav on a narrow header. */}
								<div className="d-flex flex-wrap align-items-center gap-2">
									<div className="btn-group btn-group-sm">
										{VIEWS.map((item) => (
											<button
												key={item.key}
												type="button"
												className={`btn btn-${
													view === item.key ? "secondary" : "outline-secondary"
												}`}
												onClick={() => changeView(item.key)}
											>
												{item.label}
											</button>
										))}
									</div>
									<button
										type="button"
										className="btn btn-outline-secondary btn-sm"
										onClick={() => router.refresh()}
										aria-label="Reload from API"
									>
										<i
											className="fa-solid fa-arrows-rotate"
											aria-hidden="true"
										/>
									</button>
									<button
										type="button"
										className="btn btn-primary btn-sm"
										onClick={() => openCreate()}
									>
										<i
											className="fa-solid fa-calendar-plus me-1"
											aria-hidden="true"
										/>
										New entry
									</button>
								</div>
							</div>
							<div className="card-body border-bottom py-2">
								<FiltersBar
									filters={filters}
									setFilters={setFilters}
									resetFilters={() => setFilters(DEFAULT_FILTERS)}
								/>
							</div>
							<div className="card-body">
								{view === "month" ? <MonthView {...viewProps} /> : null}
								{view === "week" ? <WeekView {...viewProps} /> : null}
								{view === "agenda" ? (
									<AgendaView
										cursor={cursor}
										visibleEvents={occurrences}
										onSelectEvent={setSelected}
									/>
								) : null}
								<p className="text-body-secondary small mb-0 mt-2">
									Double-click a day to book. Drag an appointment onto another
									day to reschedule it.
								</p>
							</div>
						</div>
					</div>
					<div className="col-xl-3">
						<UpcomingPanel
							visibleEvents={occurrences}
							clock={clock}
							onSelectEvent={setSelected}
						/>
					</div>
				</div>
			</div>
			<EventDetailModal
				event={selected}
				onHide={() => setSelected(null)}
				onEdit={openEdit}
				onTrash={trashEvent}
				onRestore={restoreEvent}
				onRemove={removeEvent}
			/>
			<EventFormModal
				show={formOpen}
				event={editing}
				defaultDay={defaultDay}
				errorMessage={formError}
				findBlocker={blockerFor}
				onError={setFormError}
				onSaved={() => {
					refreshAvailability();
					router.refresh();
				}}
				onHide={() => {
					setFormOpen(false);
					setEditing(null);
					setFormError("");
				}}
			/>
		</>
	);
};

export default Scheduler;
