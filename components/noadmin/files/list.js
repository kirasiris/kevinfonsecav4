"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Single from "./single";
import { useUploadBridge } from "@/context/uploadbridgecontext";

const FILE_TYPE_MAP = {
	image: {
		label: "Image",
		className: "bg-success",
		textClass: "text-info",
		exts: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"],
	},
	video: {
		label: "Video",
		className: "bg-primary",
		textClass: "text-success",
		exts: ["mp4", "webm", "mov", "avi", "mkv"],
	},
	audio: {
		label: "Audio",
		className: "bg-warning text-dark",
		textClass: "text-warning",
		exts: ["mp3", "wav", "ogg", "m4a", "flac", "mpeg"],
	},
	document: {
		label: "Document",
		className: "bg-danger",
		textClass: "text-danger",
		exts: ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"],
	},
};

const getExtension = (filename = "") => {
	const dot = filename.lastIndexOf(".");
	return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
};

const classifyFile = (file) => {
	// Prefer the API-provided format_type (most reliable across all records).
	const apiType =
		typeof file?.format_type === "string" ? file.format_type.toLowerCase() : "";
	if (FILE_TYPE_MAP[apiType]) {
		return { type: apiType, ...FILE_TYPE_MAP[apiType] };
	}
	// Fallback: classify by the file extension parsed from the filename.
	const filename = file?.location?.filename || "";
	const ext = getExtension(filename);
	for (const key of Object.keys(FILE_TYPE_MAP)) {
		if (FILE_TYPE_MAP[key].exts.includes(ext)) {
			return { type: key, ...FILE_TYPE_MAP[key] };
		}
	}
	return {
		type: "other",
		label: ext ? ext.toUpperCase() : "File",
		className: "bg-secondary",
		textClass: "text-secondary",
	};
};

const buildKey = (file, pageHint) =>
	file?._id ||
	file?.location?.public_id ||
	`${file?.location?.filename || "file"}-${pageHint}-${Math.random().toString(36).slice(2)}`;

// Builds the deduplicated initial list and seeds the shared "seen" set in one
// pass. Called from a useState initializer so it only runs once per mount.
const seedFromObjects = (objects, pageHint, seenSet) => {
	const rawList = Array.isArray(objects?.data) ? objects.data : [];
	const result = [];
	for (const file of rawList) {
		const key = buildKey(file, pageHint);
		if (!seenSet.has(key)) {
			seenSet.add(key);
			result.push({ ...file, __key: key });
		}
	}
	return result;
};

const List = ({ objects = [], searchParams = {} }) => {
	const initialPage = useMemo(() => {
		const fromSearch = Number(searchParams?.page);
		if (Number.isFinite(fromSearch) && fromSearch > 0) {
			return fromSearch;
		}
		const fromPayload = Number(objects?.pagination?.current);
		if (Number.isFinite(fromPayload) && fromPayload > 0) {
			return fromPayload;
		}
		return 1; // Default page
	}, [searchParams?.page, objects?.pagination?.current]);

	const limit = useMemo(() => {
		const fromSearch = Number(searchParams?.limit);
		if (Number.isFinite(fromSearch) && fromSearch > 0) {
			return fromSearch;
		}
		const fromPayload = Number(objects?.pagination?.next?.limit);
		if (Number.isFinite(fromPayload) && fromPayload > 0) {
			return fromPayload;
		}
		return 32; // Default limit
	}, [searchParams?.limit, objects?.pagination?.next?.limit]);

	const sort = searchParams?.sort || "-createdAt";
	const prependNew = !sort || sort.startsWith("-");

	const uploadBridge = useUploadBridge();

	// The seen-set is a ref so it survives renders without state-driven churn.
	// We initialize it lazily alongside the initial files state so the seed
	// happens exactly once per mount and never during a render pass.
	const seenKeysRef = useRef(null);
	if (seenKeysRef.current === null) {
		seenKeysRef.current = new Set();
	}
	const isFetchingRef = useRef(false);

	const [newobjects, setNewObjects] = useState(() =>
		seedFromObjects(objects, initialPage, seenKeysRef.current),
	);
	const [lastLoadedPage, setLastLoadedPage] = useState(initialPage);
	const [totalResults, setTotalResults] = useState({
		...objects,
		countAll: typeof objects?.countAll === "number" ? objects.countAll : null,
	});

	const [hasMore, setHasMore] = useState(() => {
		if (objects?.pagination?.next?.page) {
			return true;
		}
		const total = Number(objects?.pagination?.totalpages);
		if (Number.isFinite(total)) {
			return initialPage < total;
		}

		// No SSR payload — assume there's more and let the first fetch tell us.
		return !objects;
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [deletingKey, setDeletingKey] = useState(null);

	const sentinelRef = useRef(null);

	const fetchPage = useCallback(
		async (pageToLoad, signal) => {
			if (isFetchingRef.current) {
				return;
			}
			isFetchingRef.current = true;
			setLoading(true);
			setError(false);

			const res = await fetchurl(
				`/global/files?page=${pageToLoad}&limit=${limit}&sort=${sort}`,
				"GET",
				"no-cache",
				{},
				signal,
				false,
				false,
			);
			if (!res.success) {
				setError(true);
				toast.error("Failed to retrieve files");
			}

			const rawList = Array.isArray(res?.data) ? res.data : [];
			const fresh = [];
			for (const file of rawList) {
				const key = buildKey(file, pageToLoad);
				if (!seenKeysRef.current.has(key)) {
					seenKeysRef.current.add(key);
					fresh.push({ ...file, __key: key });
				}
			}

			if (fresh.length > 0) {
				setNewObjects((prev) => [...prev, ...fresh]);
			}

			if (typeof res?.countAll === "number") {
				setTotalResults({ countAll: res.countAll });
			}

			// pagination.next is the canonical "is there more?" indicator.
			// Fall back to totalpages, and only as a last resort guess from length.
			const nextPage = res?.pagination?.next?.page;
			const totalPages = Number(res?.pagination?.totalpages);
			if (nextPage) {
				setHasMore(true);
			} else if (Number.isFinite(totalPages)) {
				setHasMore(pageToLoad < totalPages);
			} else {
				setHasMore(rawList.length >= limit);
			}

			setLastLoadedPage(pageToLoad);
			isFetchingRef.current = false;
			setLoading(false);
		},
		[limit, sort],
	);

	// Initial client-side fetch is only needed when SSR didn't supply `objects`.
	useEffect(() => {
		if (objects) {
			return;
		}
		const controller = new AbortController();
		fetchPage(initialPage, controller.signal);
		return () => {
			controller.abort();
		};
	}, [objects, initialPage, fetchPage]);

	// Infinite-scroll observer. Loads the page AFTER the last one we've shown.
	// We deliberately exclude `loading` from the deps to avoid recreating the
	// observer on every fetch — the `isFetchingRef` guard inside is enough.
	useEffect(() => {
		if (!hasMore || error) {
			return;
		}
		const node = sentinelRef.current;
		if (!node) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && !isFetchingRef.current && hasMore) {
					fetchPage(lastLoadedPage + 1);
				}
			},
			{ rootMargin: "200px 0px" },
		);

		observer.observe(node);
		return () => {
			observer.disconnect();
		};
	}, [lastLoadedPage, hasMore, error, fetchPage]);

	// Listen for files uploaded by the MultimediaManager and insert them into
	// the list (respecting sort order). Dedup via the shared seen-set so a file
	// that later arrives from the API on a paged fetch isn't duplicated.
	useEffect(() => {
		if (!uploadBridge) {
			return;
		}
		return uploadBridge.subscribe((file) => {
			const key = buildKey(file, "upload");
			if (seenKeysRef.current.has(key)) return;
			seenKeysRef.current.add(key);
			const entry = { ...file, __key: key };
			setNewObjects((prev) =>
				prependNew ? [entry, ...prev] : [...prev, entry],
			);
			setTotalResults((t) => (typeof t === "number" ? t + 1 : t));
		});
	}, [uploadBridge, prependNew]);

	const handleDelete = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setDeletingKey(item.__key);
		const res = await fetchurl(
			`/noadmin/files/${item?._id}/permanently`,
			"DELETE",
			"no-cache",
		);
		if (res.status === "error") {
			toast.error(res.message);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			return;
		}
		toast.success("File deleted");
		setNewObjects((prev) => prev.filter((f) => f.__key !== item.__key));
		seenKeysRef.current.delete(item.__key);
		setTotalResults((t) => (typeof t === "number" ? Math.max(0, t - 1) : t));
		setDeletingKey(null);
	}, []);

	const handleRetry = useCallback(() => {
		setError(false);
		fetchPage(lastLoadedPage + 1);
	}, [fetchPage, lastLoadedPage]);

	const items = useMemo(
		() =>
			newobjects.map((file) => ({
				key: file.__key,
				raw: file,
				filename: file?.location?.filename || "unknown",
				url: file?.location?.secure_location || "",
				size: file?.size,
				info: classifyFile(file),
			})),
		[newobjects],
	);

	return (
		<>
			{error && (
				<div
					className="alert alert-danger d-flex justify-content-between align-items-center"
					role="alert"
				>
					<span>
						<strong>Error:</strong> {error}
					</span>
					<button
						type="button"
						className="btn btn-outline-danger btn-sm"
						onClick={handleRetry}
					>
						Retry
					</button>
				</div>
			)}
			{!error && items.length === 0 && !loading && (
				<div className="alert alert-info mb-0" role="alert">
					No files were returned from the API.
				</div>
			)}
			{items.length > 0 && (
				<div className="row g-3">
					{items.map((item, index) => {
						const isDeleting = deletingKey === item.key;
						return (
							<Single
								key={item.key}
								index={index}
								object={item}
								handleDelete={handleDelete}
								isDeleting={isDeleting}
							/>
						);
					})}
				</div>
			)}
			{/* Sentinel + status row used by the IntersectionObserver */}
			<div ref={sentinelRef} className="text-center py-4">
				{loading && (
					<div className="d-inline-flex align-items-center gap-2 text-muted">
						<div
							className="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						<small>Loading more files...</small>
						<br />
						{!error && (
							<span className="badge bg-light text-dark">
								{items.length}
								{totalResults.countAll != null
									? ` / ${totalResults.countAll}`
									: ""}{" "}
								file
								{items.length !== 1 ? "s" : ""}
							</span>
						)}
					</div>
				)}
				{!loading && !hasMore && items.length > 0 && (
					<>
						<small>No more files to load.</small>
						<br />
						{!error && (
							<span className="badge bg-light text-dark">
								{items.length}
								{totalResults.countAll != null
									? ` / ${totalResults.countAll}`
									: ""}{" "}
								file
								{items.length !== 1 ? "s" : ""}
							</span>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default List;
