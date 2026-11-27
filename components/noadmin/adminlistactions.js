"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
	isEmptyPage,
	isFailure,
	positiveNumber,
	safeFetch,
} from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";
import { actionMessage } from "@/components/global/actionfeedback";

const rowsOf = (objects) => (Array.isArray(objects?.data) ? objects.data : []);

const countAllOf = (objects) => positiveNumber(objects?.countAll) || 0;

const paramsOf = (searchParams) => {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(searchParams || {})) {
		if (value !== undefined && value !== null && value !== "") {
			params.set(key, String(value));
		}
	}
	return params;
};

const hrefForPage = (searchParams, page) => {
	const params = paramsOf(searchParams);
	params.set("page", String(page));
	return `?${params.toString()}`;
};

const queryKeyOf = (searchParams) => {
	const params = paramsOf(searchParams);
	params.sort();
	return params.toString();
};

export function usePagedList({ objects, searchParams = {} }) {
	const router = useRouter();
	const page = positiveNumber(searchParams.page) || 1;
	const limit = positiveNumber(searchParams.limit) || 10;
	const queryKey = queryKeyOf(searchParams);

	const [seed, setSeed] = useState(objects);
	const [seedQueryKey, setSeedQueryKey] = useState(queryKey);
	const [rows, setRows] = useState(() => rowsOf(objects));
	const [countAll, setCountAll] = useState(() => countAllOf(objects));
	const [leavingIds, setLeavingIds] = useState(() => new Set());
	const [enteringIds, setEnteringIds] = useState(() => new Set());
	const [syncRequest, setSyncRequest] = useState(0);
	const handledSyncRef = useRef(0);
	const rowsRef = useRef(rows);

	if (objects !== seed) {
		const fresh = rowsOf(objects);
		const shown = new Set(rows.map((row) => row._id));
		setSeed(objects);
		setSeedQueryKey(queryKey);
		setRows(fresh);
		setCountAll(countAllOf(objects));
		setLeavingIds((prev) => {
			if (!prev.size) return prev;
			const listed = new Set(fresh.map((row) => row._id));
			return new Set([...prev].filter((id) => listed.has(id)));
		});
		setEnteringIds(
			queryKey === seedQueryKey
				? new Set(
						fresh.filter((row) => !shown.has(row._id)).map((row) => row._id),
					)
				: new Set(),
		);
	}

	useEffect(() => {
		rowsRef.current = rows;
	}, [rows]);

	const leavingCount = rows.reduce(
		(n, row) => n + (leavingIds.has(row._id) ? 1 : 0),
		0,
	);

	useEffect(() => {
		if (syncRequest === handledSyncRef.current || leavingCount > 0) return;
		handledSyncRef.current = syncRequest;
		const lastPage = Math.max(1, Math.ceil(countAll / limit));
		if (rows.length === 0 && page > lastPage) {
			router.replace(hrefForPage(searchParams, lastPage), { scroll: false });
		} else {
			router.refresh();
		}
	}, [
		syncRequest,
		leavingCount,
		rows,
		countAll,
		limit,
		page,
		router,
		searchParams,
	]);

	const requestSync = useCallback(() => setSyncRequest((n) => n + 1), []);

	const patchRow = useCallback((id, patch) => {
		setRows((prev) =>
			prev.map((row) => (row._id === id ? { ...row, ...patch } : row)),
		);
	}, []);

	const patchAll = useCallback((patch) => {
		setRows((prev) => prev.map((row) => ({ ...row, ...patch })));
	}, []);

	const leaveRow = useCallback((id) => {
		setLeavingIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
		setSyncRequest((n) => n + 1);
	}, []);

	const leaveAll = useCallback(() => {
		setLeavingIds(new Set(rowsRef.current.map((row) => row._id)));
		setSyncRequest((n) => n + 1);
	}, []);

	const finishLeave = useCallback((id) => {
		setRows((prev) => prev.filter((row) => row._id !== id));
		setLeavingIds((prev) => {
			if (!prev.has(id)) return prev;
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
		setCountAll((prev) => Math.max(0, prev - 1));
	}, []);

	const finishEnter = useCallback((id) => {
		setEnteringIds((prev) => {
			if (!prev.has(id)) return prev;
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const totalPages =
		positiveNumber(objects?.pagination?.totalpages) ||
		Math.max(1, Math.ceil(countAllOf(objects) / limit));

	const loadError =
		isFailure(objects) && !isEmptyPage(objects)
			? actionMessage(objects, "Could not load this list")
			: "";

	return {
		rows,
		visibleCount: rows.length - leavingCount,
		visibleCountAll: Math.max(0, countAll - leavingCount),
		setCountAll,
		leavingIds,
		enteringIds,
		currentPage: positiveNumber(objects?.pagination?.current) || page,
		totalPages,
		loadError,
		requestSync,
		patchRow,
		patchAll,
		leaveRow,
		leaveAll,
		finishLeave,
		finishEnter,
	};
}

/**
 * @path needs to match the API route
 * @patch the value of the object's status to be changed
 * @verb the text to be shown while action is false
 * @done the text to be shown after action is done
 */
const ROW_ACTIONS = {
	archived: {
		path: "trashit",
		patch: { status: "archived" },
		verb: "archive",
		done: "archived",
	},
	acquired: {
		path: "acquireit",
		patch: { status: "acquired" },
		verb: "acquire",
		done: "acquired",
	},
	disposed: {
		path: "disposeit",
		patch: { status: "disposed" },
		verb: "dispose",
		done: "disposed",
	},
	draft: {
		path: "draftit",
		patch: { status: "draft" },
		verb: "draft",
		done: "drafted",
	},
	publish: {
		path: "publishit",
		patch: { status: "published" },
		verb: "publish",
		done: "published",
	},
	trash: {
		path: "trashit",
		patch: { status: "trash" },
		verb: "trash",
		done: "trashed",
	},
	schedule: {
		path: "scheduleit",
		patch: { status: "scheduled" },
		verb: "schedule",
		done: "scheduled",
	},
	feature: {
		path: "featureit",
		patch: { featured: true },
		verb: "feature",
		done: "featured",
	},
	unfeature: {
		path: "unfeatureit",
		patch: { featured: false },
		verb: "unfeature",
		done: "unfeatured",
	},
	usageCount: {
		path: "usagecount",
		patch: {},
		verb: "update the usage count of",
		done: "usage count updated",
	},
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function useAdminListActions({
	list,
	endpoint,
	noun,
	nounPlural = noun + "s",
	statusFilter = "",
	bulkBody = {},
	usageCountAllEndpoint = "",
}) {
	const isMountedRef = useIsMounted();
	const { patchRow, patchAll, leaveRow, leaveAll, setCountAll, requestSync } =
		list;
	const busyRef = useRef(new Map());
	const [busy, setBusy] = useState({});
	const bulkBusyRef = useRef(false);
	const [trashingAll, setTrashingAll] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);
	const [countingAll, setCountingAll] = useState(false);

	const setRowBusy = (id, action) => {
		if (action) busyRef.current.set(id, action);
		else busyRef.current.delete(id);
		setBusy(Object.fromEntries(busyRef.current));
	};

	const isBusy = (id, action) => busy[id] === action;

	const runRowAction = async (item, action, request) => {
		if (!item?._id)
			return { status: "error", message: `This ${noun} has no id` };
		if (busyRef.current.has(item._id)) {
			return {
				status: "error",
				message: `This ${noun} is still being updated`,
			};
		}
		setRowBusy(item._id, action);
		const res = await safeFetch(...request);
		if (isMountedRef.current) setRowBusy(item._id, null);
		return res;
	};

	const changeStatus = (action) => async (item) => {
		const { path, patch, verb, done } = ROW_ACTIONS[action];
		const res = await runRowAction(item, action, [
			`${endpoint}/${item?._id}/${path}`,
			"PUT",
			"no-cache",
		]);
		if (!isMountedRef.current) return res;
		if (isFailure(res)) {
			toast.error(actionMessage(res, `Could not ${verb} the ${noun}`));
			return res;
		}
		toast.success(`${capitalize(noun)} ${done}`);
		patchRow(item._id, patch);
		if (statusFilter && patch.status && patch.status !== statusFilter) {
			leaveRow(item._id);
		} else {
			requestSync();
		}
		return res;
	};

	const handleArchiveIt = changeStatus("archived");
	const handleAcquireIt = changeStatus("acquired");
	const handleDisposeIt = changeStatus("disposed");
	const handleDraftIt = changeStatus("draft");
	const handlePublishIt = changeStatus("publish");
	const handleTrashIt = changeStatus("trash");
	const handleScheduleIt = changeStatus("schedule");
	const handleFeatureIt = changeStatus("feature");
	const handleUnfeatureIt = changeStatus("unfeature");
	const handleUsageCountIt = changeStatus("usageCount");

	const handleDeleteIt = async (item) => {
		const res = await runRowAction(item, "delete", [
			`${endpoint}/${item?._id}/permanently`,
			"DELETE",
			"no-cache",
		]);
		if (!isMountedRef.current || isFailure(res)) return res;
		toast.success(`${capitalize(noun)} deleted`);
		return res;
	};

	const runBulk = async (setFlag, request) => {
		if (bulkBusyRef.current) {
			return {
				status: "error",
				message: "Another bulk action is still running",
			};
		}
		bulkBusyRef.current = true;
		setFlag(true);
		const res = await safeFetch(...request);
		bulkBusyRef.current = false;
		if (isMountedRef.current) setFlag(false);
		return res;
	};

	const handleTrashAll = async () => {
		const res = await runBulk(setTrashingAll, [
			`${endpoint}/deleteall`,
			"PUT",
			"no-cache",
			bulkBody,
		]);
		if (!isMountedRef.current || isFailure(res)) return res;
		toast.success(`All ${nounPlural} trashed`);
		patchAll({ status: "trash" });
		if (statusFilter && statusFilter !== "trash") {
			setCountAll(0);
			leaveAll();
		} else {
			requestSync();
		}
		return res;
	};

	const handleDeleteAll = async () => {
		const res = await runBulk(setDeletingAll, [
			`${endpoint}/deleteall/permanently`,
			"DELETE",
			"no-cache",
			bulkBody,
		]);
		if (!isMountedRef.current || isFailure(res)) return res;
		toast.success(`All ${nounPlural} deleted`);
		setCountAll(0);
		leaveAll();
		return res;
	};

	const handleUsageCountAll = async () => {
		const res = await runBulk(setCountingAll, [
			usageCountAllEndpoint,
			"PUT",
			"no-cache",
		]);
		if (!isMountedRef.current) return res;
		if (isFailure(res)) {
			toast.error(actionMessage(res, "Could not update the usage counts"));
			return res;
		}
		toast.success("Usage counts updated");
		requestSync();
		return res;
	};

	return {
		isBusy,
		handleArchiveIt,
		handleAcquireIt,
		handleDisposeIt,
		handleDraftIt,
		handlePublishIt,
		handleTrashIt,
		handleScheduleIt,
		handleFeatureIt,
		handleUnfeatureIt,
		handleUsageCountIt,
		handleDeleteIt,
		trashingAll,
		deletingAll,
		countingAll,
		handleTrashAll,
		handleDeleteAll,
		handleUsageCountAll,
	};
}
