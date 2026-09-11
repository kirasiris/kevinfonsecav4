"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { addDays, dayToIso, isoToDay, startOfWeek, toDay } from "./date-utils";

async function getAvailability({ from, to }) {
	const params = new URLSearchParams({ from: from || "", to: to || "" });
	const res = await fetchurl(
		`/noadmin/events/availability?${params.toString()}`,
	);
	return res;
}

/**
 * Server-computed occupancy for the visible window.
 *
 * The scheduler used to derive this itself by expanding recurrence in the
 * browser and scanning for all-day entries. That is now the API's job, so this
 * hook only caches the answer.
 *
 * It deliberately exposes the same two shapes the view components already
 * consume — a `Set` of "MM/DD/YYYY" keys and a `blockerFor(day, ignoreId)`
 * lookup — so nothing downstream of `viewProps` has to change.
 *
 * There is no `useEffect` fetch here on purpose: the window only ever changes
 * from a user action (prev / next / today / view switch), so `loadWindow` is
 * called from those handlers instead.
 */

/** The window the calendar needs, matching the grid's own overscan. */
export function windowFor(cursor, view) {
	const anchor =
		view === "week"
			? startOfWeek(cursor)
			: startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
	const length = view === "week" ? 7 : 42;

	return {
		start: toDay(addDays(anchor, -7)),
		end: toDay(addDays(anchor, length + 7)),
	};
}

/**
 * Translates the API payload into the browser's internal "MM/DD/YYYY" keys.
 * The API speaks canonical ISO days; date-utils speaks US days.
 */
function fromPayload(payload) {
	const data = (payload && payload.data) || payload || {};
	const source = data.blockedDays || {};

	const blockedDays = new Set();
	const blockers = {};

	Object.keys(source).forEach((iso) => {
		const key = isoToDay(iso);
		blockedDays.add(key);
		blockers[key] = source[iso];
	});

	return {
		blockedDays,
		blockers,
		from: data.from || "",
		to: data.to || "",
	};
}

const EMPTY = { blockedDays: new Set(), blockers: {}, from: "", to: "" };

export function useAvailability(initialAvailability) {
	const [snapshot, setSnapshot] = useState(() =>
		initialAvailability ? fromPayload(initialAvailability) : EMPTY,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Guards against a slow response for an old window overwriting a newer one.
	const requestIdRef = useRef(0);
	const lastSignatureRef = useRef(
		initialAvailability
			? `${fromPayload(initialAvailability).from}|${fromPayload(initialAvailability).to}`
			: "",
	);

	const request = useCallback(async (fromIso, toIso) => {
		const requestId = requestIdRef.current + 1;
		requestIdRef.current = requestId;

		setLoading(true);

		const result = await getAvailability({ from: fromIso, to: toIso });

		// A newer window was requested while this was in flight.
		if (requestIdRef.current !== requestId) return result;

		setLoading(false);

		if (!result.ok) {
			// The previous snapshot is kept rather than cleared: showing every day as
			// bookable after a failed lookup would be worse than showing stale state.
			setError(result.message || "Could not load availability.");
			return result;
		}

		setError("");
		setSnapshot(fromPayload(result.data));
		return result;
	}, []);

	/**
	 * Loads a window if it is not already loaded. `dayKey` arguments are the
	 * internal "MM/DD/YYYY" form used everywhere in the calendar.
	 */
	const loadWindow = useCallback(
		(fromDayKey, toDayKey) => {
			const fromIso = dayToIso(fromDayKey);
			const toIso = dayToIso(toDayKey);
			const signature = `${fromIso}|${toIso}`;

			if (lastSignatureRef.current === signature)
				return Promise.resolve({ ok: true });
			lastSignatureRef.current = signature;

			return request(fromIso, toIso);
		},
		[request],
	);

	/** Re-requests the current window, ignoring the cache. Call after a write. */
	const refresh = useCallback(() => {
		const [fromIso, toIso] = lastSignatureRef.current.split("|");
		if (!fromIso || !toIso) return Promise.resolve({ ok: true });
		return request(fromIso, toIso);
	}, [request]);

	/** Convenience for the navigation handlers. */
	const loadFor = useCallback(
		(cursor, view) => {
			const next = windowFor(cursor, view);
			return loadWindow(next.start, next.end);
		},
		[loadWindow],
	);

	/**
	 * The entry that makes `day` unavailable, or null when it is free.
	 * Returns the blocker itself so callers can name it in the message.
	 */
	const blockerFor = useCallback(
		(day, ignoreId) => {
			const blocker = snapshot.blockers[day];
			if (!blocker) return null;
			// Skip the entry being edited or dragged, so it never blocks itself.
			if (ignoreId && String(blocker.id) === String(ignoreId)) return null;
			return blocker;
		},
		[snapshot.blockers],
	);

	return useMemo(
		() => ({
			blockedDays: snapshot.blockedDays,
			blockerFor,
			loadFor,
			loadWindow,
			refresh,
			loading,
			error,
		}),
		[
			snapshot.blockedDays,
			blockerFor,
			loadFor,
			loadWindow,
			refresh,
			loading,
			error,
		],
	);
}
