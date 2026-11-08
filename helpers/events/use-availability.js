"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { addDays, dayToIso, isoToDay, startOfWeek, toDay } from "./date-utils";
import { fetchurl } from "../setTokenOnServer";

async function getAvailability({ from, to }) {
	const params = new URLSearchParams({ from: from || "", to: to || "" });
	const res = await fetchurl(
		`/noadmin/events/availability?${params.toString()}`,
	);
	return res;
}

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

		if (requestIdRef.current !== requestId) return result;

		setLoading(false);

		if (!result.ok) {
			setError(result.message || "Could not load availability.");
			return result;
		}

		setError("");
		setSnapshot(fromPayload(result.data));
		return result;
	}, []);

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

	const refresh = useCallback(() => {
		const [fromIso, toIso] = lastSignatureRef.current.split("|");
		if (!fromIso || !toIso) return Promise.resolve({ ok: true });
		return request(fromIso, toIso);
	}, [request]);

	const loadFor = useCallback(
		(cursor, view) => {
			const next = windowFor(cursor, view);
			return loadWindow(next.start, next.end);
		},
		[loadWindow],
	);

	const blockerFor = useCallback(
		(day, ignoreId) => {
			const blocker = snapshot.blockers[day];
			if (!blocker) return null;
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
