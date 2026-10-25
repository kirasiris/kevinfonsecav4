"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { formatFileSize } from "@/helpers/formatFileSize";
import Single from "./songsingle";

/* -------------------------------------------------------------------------- */
/* List helpers                                                               */
/* -------------------------------------------------------------------------- */

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
	const apiType =
		typeof file?.format_type === "string" ? file.format_type.toLowerCase() : "";
	if (FILE_TYPE_MAP[apiType]) {
		return { type: apiType, ...FILE_TYPE_MAP[apiType] };
	}
	const ext = getExtension(file?.location?.filename || "");
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
	`${file?.location?.filename || "file"}-${pageHint}-${Math.random()
		.toString(36)
		.slice(2)}`;

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

/* -------------------------------------------------------------------------- */
/* Request helpers                                                            */
/* -------------------------------------------------------------------------- */

// fetchurl can reject (network drop, abort) or resolve to nothing; turn both
// into the API's own error shape so every caller has a single path to check.
const safeFetch = async (...args) => {
	try {
		const res = await fetchurl(...args);
		return res || { status: "error", message: "No response from the server" };
	} catch (err) {
		return { status: "error", message: err?.message || "Network error" };
	}
};

const isFailure = (res) =>
	!res || res.status === "error" || res.status === "fail";

// The API answers an empty list (or a page past the end) with a "fail", which
// must be shown as "no files" rather than as an error.
const isEmptyPage = (res) =>
	res?.status === "fail" && /does not exist/i.test(res?.message || "");

// Used while a search filter is active: drop indexes refer to the filtered
// list, so reordering it would move the wrong items in the full list.
const DRAG_DISABLED = { draggable: false, style: {}, className: "" };

/* -------------------------------------------------------------------------- */
/* Upload helpers                                                             */
/* -------------------------------------------------------------------------- */

const ACCEPTED_FILE_TYPES = "audio/*";

const isAcceptedFile = (file) => (file?.type || "").startsWith("audio/");

const generateId = () => Math.random().toString(36).slice(2, 9);

const getFileType = (mimeType = "") => {
	if (mimeType.startsWith("image/")) return "image";
	if (mimeType.startsWith("video/")) return "video";
	return "audio";
};

const getMediaIcon = (type) => {
	switch (type) {
		case "audio":
			return <i aria-hidden className="fa-solid fa-file-audio fa-xl" />;
		case "video":
			return <i aria-hidden className="fa-solid fa-file-video fa-xl" />;
		case "image":
			return <i aria-hidden className="fa-solid fa-file-image fa-xl" />;
		default:
			return <i aria-hidden className="fa-solid fa-file-pdf fa-xl" />;
	}
};

const uploadFileToServer = (
	blob,
	filename,
	onProgress,
	auth = {},
	token = {},
	object = {},
) => {
	const xhr = new XMLHttpRequest();
	const res = new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append("userId", auth?.data?._id);
		formData.append("username", auth?.data?.username);
		formData.append("userEmail", auth?.data?.email);
		formData.append("onModel", "Playlist");
		formData.append("resourceId", object?._id);
		formData.append("file", blob, filename);
		formData.append("album", "albums");

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable) {
				onProgress(Math.round((event.loaded * 100) / event.total));
			}
		});

		xhr.addEventListener("load", async () => {
			if (xhr.status < 200 || xhr.status >= 300) {
				reject(
					new Error(
						`Upload failed with status ${xhr.status}: ${xhr.statusText}`,
					),
				);
				return;
			}
			let parsed;
			try {
				parsed = JSON.parse(xhr.responseText);
			} catch {
				reject(
					new Error("Upload finished but the server reply was not valid JSON"),
				);
				return;
			}
			if (parsed?.success === false) {
				reject(new Error(parsed?.message || "Upload failed"));
				return;
			}

			const record = await safeFetch(
				`/noadmin/songs`,
				"POST",
				"no-cache",
				{
					resourceId: object?._id,
					duration: "0:0",
					status: "draft",
					averageRating: 5,
					onModel: "Playlist",
					title: parsed?.data?.title,
					sub_title: parsed?.data?.title,
					text: "No description",
					files: {
						audio_url: parsed?.data?._id,
					},
					embedding: false,
					commented: false,
				},
				undefined,
				false,
				false,
			);

			// The file is already stored at this point; report the failure
			// instead of listing an entry that has no record behind it.
			if (isFailure(record)) {
				reject(
					new Error(
						record?.message ||
							"File uploaded, but its record could not be created",
					),
				);
				return;
			}
			resolve({ file: parsed, record });
		});

		xhr.addEventListener("error", () =>
			reject(new Error("Network error during upload")),
		);
		xhr.addEventListener("abort", () =>
			reject(
				Object.assign(new Error("Upload aborted"), { name: "AbortError" }),
			),
		);
		xhr.addEventListener("timeout", () =>
			reject(new Error("Upload timed out")),
		);

		xhr.open(
			"PUT",
			`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
		);
		xhr.setRequestHeader("Authorization", `Bearer ${token?.value}`);
		xhr.send(formData);
	});

	return { res, xhr };
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const SongsMediaManager = ({
	auth = {},
	token = {},
	object = {},
	objects = [],
	searchParams = {},
}) => {
	/* ------------------------------ Paging setup ---------------------------- */

	const initialPage = useMemo(() => {
		const fromSearch = Number(searchParams?.page);
		if (Number.isFinite(fromSearch) && fromSearch > 0) {
			return fromSearch;
		}
		const fromPayload = Number(objects?.pagination?.current);
		if (Number.isFinite(fromPayload) && fromPayload > 0) {
			return fromPayload;
		}
		return 1;
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
		return 32;
	}, [searchParams?.limit, objects?.pagination?.next?.limit]);

	const sort = searchParams?.sort || "orderingNumber";
	const prependNew = !sort || sort.startsWith("-");
	const hasSsrPayload = Array.isArray(objects?.data);

	/* ------------------------------- List state ----------------------------- */

	const seenKeysRef = useRef(null);
	if (seenKeysRef.current === null) {
		seenKeysRef.current = new Set();
	}
	const activeRequestRef = useRef(null);
	const isMountedRef = useRef(false);
	const sentinelRef = useRef(null);

	const [newobjects, setNewObjects] = useState(() =>
		seedFromObjects(objects, initialPage, seenKeysRef.current),
	);
	// Without a payload nothing is loaded yet, so the first fetch (and its
	// Retry) must request initialPage itself.
	const [lastLoadedPage, setLastLoadedPage] = useState(
		hasSsrPayload ? initialPage : initialPage - 1,
	);
	const [countAll, setCountAll] = useState(
		typeof objects?.countAll === "number" ? objects.countAll : null,
	);
	const [hasMore, setHasMore] = useState(() => {
		if (objects?.pagination?.next?.page) {
			return true;
		}
		const total = Number(objects?.pagination?.totalpages);
		if (Number.isFinite(total)) {
			return initialPage < total;
		}
		return !hasSsrPayload;
	});
	const [loading, setLoading] = useState(!hasSsrPayload);
	const [error, setError] = useState(null);
	const [draftingKey, setDraftingKey] = useState(null);
	const [publishingKey, setPublishingKey] = useState(null);
	const [trashingKey, setTrashingKey] = useState(null);
	const [schedulingKey, setSchedulingKey] = useState(null);
	const [deletingKey, setDeletingKey] = useState(null);
	const [trashingAll, setTrashingAll] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);
	const [itemDraggedIndex, setItemDraggedIndex] = useState(null);
	const [itemDragOverIndex, setItemDragOverIndex] = useState(null);
	const [isDirty, setIsDirty] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [success, setSuccess] = useState("");

	/* ------------------------------ Upload state ---------------------------- */

	const [files, setFiles] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [showMicrophone, setShowMicrophone] = useState(false);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [pendingMediaType, setPendingMediaType] = useState(null);
	const [permissions, setPermissions] = useState({ audio: false });
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);

	const fileInputRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const chunksRef = useRef([]);
	const mediaElementsRef = useRef(new Map());
	const waveformRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const animationFrameRef = useRef(null);
	const uploadsRef = useRef([]);
	const uploadXhrsRef = useRef(new Map());
	// Every object URL created here, so unmount can revoke them all — including
	// ones created in the same tick as the unmount, before uploadsRef caught up.
	const objectUrlsRef = useRef(new Set());
	// Object URLs the saved list is displaying (the server sent no location).
	// Removing the tray card must not revoke these.
	const keptUrlsRef = useRef(new Set());
	const startingMediaRef = useRef(false);

	/* -------------------------------- Lifecycle ----------------------------- */

	useEffect(() => {
		uploadsRef.current = files;
	}, [files]);

	useEffect(() => {
		// Strict Mode runs this cleanup on its fake unmount, so the flag has to
		// be set back to true on every setup.
		isMountedRef.current = true;
		const activeRequest = activeRequestRef;
		const animFrame = animationFrameRef;
		const audioCtx = audioContextRef;
		const analyser = analyserRef;
		const recorder = mediaRecorderRef;
		const stream = streamRef;
		const xhrs = uploadXhrsRef;
		const objectUrls = objectUrlsRef;
		const keptUrls = keptUrlsRef;
		const mediaElements = mediaElementsRef;
		return () => {
			isMountedRef.current = false;
			activeRequest.current?.abort();
			activeRequest.current = null;
			if (animFrame.current) cancelAnimationFrame(animFrame.current);
			animFrame.current = null;
			audioCtx.current?.close().catch(() => {});
			audioCtx.current = null;
			analyser.current = null;
			// Detach first: stopping a live recorder fires onstop, which would
			// otherwise start a new upload after the component is gone.
			const rec = recorder.current;
			if (rec) {
				rec.ondataavailable = null;
				rec.onstop = null;
				if (rec.state !== "inactive") rec.stop();
			}
			recorder.current = null;
			stream.current?.getTracks().forEach((track) => track.stop());
			stream.current = null;
			xhrs.current.forEach((xhr) => xhr.abort());
			xhrs.current.clear();
			objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
			objectUrls.current.clear();
			keptUrls.current.clear();
			mediaElements.current.clear();
		};
	}, []);

	/* ------------------------------- Object URLs ---------------------------- */

	const createObjectUrl = useCallback((blob) => {
		const url = URL.createObjectURL(blob);
		objectUrlsRef.current.add(url);
		return url;
	}, []);

	const revokeObjectUrl = useCallback((url) => {
		if (!url || keptUrlsRef.current.has(url)) {
			return;
		}
		URL.revokeObjectURL(url);
		objectUrlsRef.current.delete(url);
	}, []);

	/* ---------------------------- List data loading ------------------------- */

	const fetchPage = useCallback(
		async (pageToLoad) => {
			if (activeRequestRef.current) {
				return;
			}
			const controller = new AbortController();
			activeRequestRef.current = controller;
			setLoading(true);
			setError(null);

			try {
				const res = await safeFetch(
					`/global/songs?resourceId=${object?._id}&page=${pageToLoad}&limit=${limit}&sort=${sort}`,
					"GET",
					"no-cache",
					{},
					// Never pass an AbortSignal here: fetchurl is a Server Action, and the
					// signal arrives on the server as an opaque reference it cannot read.
					undefined,
					false,
					false,
				);
				if (controller.signal.aborted) {
					return;
				}
				if (isEmptyPage(res)) {
					setHasMore(false);
					setLastLoadedPage(pageToLoad);
					return;
				}
				if (!res?.success) {
					// lastLoadedPage is left alone so Retry requests this same page.
					const message = res?.message || "Failed to retrieve songs";
					setError(message);
					toast.error(message);
					return;
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
					setCountAll(res.countAll);
				}

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
			} finally {
				if (activeRequestRef.current === controller) {
					activeRequestRef.current = null;
					setLoading(false);
				}
			}
		},
		[object?._id, limit, sort],
	);

	// Clearing the ref here (not in fetchPage's finally, which runs later) lets
	// a Strict Mode remount start its own fetch instead of being skipped.
	const abortActiveFetch = useCallback(() => {
		activeRequestRef.current?.abort();
		activeRequestRef.current = null;
		setLoading(false);
	}, []);

	useEffect(() => {
		if (hasSsrPayload) {
			return;
		}
		fetchPage(initialPage);
		return abortActiveFetch;
	}, [hasSsrPayload, initialPage, fetchPage, abortActiveFetch]);

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
				if (entries[0]?.isIntersecting && !activeRequestRef.current) {
					fetchPage(lastLoadedPage + 1);
				}
			},
			{ rootMargin: "200px 0px" },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [lastLoadedPage, hasMore, error, fetchPage]);

	const handleRetry = useCallback(() => {
		setError(null);
		fetchPage(lastLoadedPage + 1);
	}, [fetchPage, lastLoadedPage]);

	/* ------------------------------- Row actions ---------------------------- */

	const handleDraftIt = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setDraftingKey(item.__key);
		const res = await safeFetch(
			`/noadmin/songs/${item._id}/draftit`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not draft the song");
			setDraftingKey(null);
			return;
		}
		toast.success("Song drafted");
		setNewObjects((prev) =>
			prev.map((f) => (f.__key === item.__key ? { ...f, status: "draft" } : f)),
		);
		setDraftingKey(null);
	}, []);

	const handlePublishIt = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setPublishingKey(item.__key);
		const res = await safeFetch(
			`/noadmin/songs/${item._id}/publishit`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not publish the song");
			setPublishingKey(null);
			return;
		}
		toast.success("Song published");
		setNewObjects((prev) =>
			prev.map((f) =>
				f.__key === item.__key ? { ...f, status: "published" } : f,
			),
		);
		setPublishingKey(null);
	}, []);

	const handleTrashIt = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setTrashingKey(item.__key);
		const res = await safeFetch(
			`/noadmin/songs/${item._id}/trashit`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not trash the song");
			setTrashingKey(null);
			return;
		}
		toast.success("Song trashed");
		setNewObjects((prev) =>
			prev.map((f) => (f.__key === item.__key ? { ...f, status: "trash" } : f)),
		);
		setTrashingKey(null);
	}, []);

	const handleScheduleIt = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setSchedulingKey(item.__key);
		const res = await safeFetch(
			`/noadmin/songs/${item._id}/scheduleit`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not schedule the song");
			setSchedulingKey(null);
			return;
		}
		toast.success("Song scheduled");
		setNewObjects((prev) =>
			prev.map((f) =>
				f.__key === item.__key ? { ...f, status: "scheduled" } : f,
			),
		);
		setSchedulingKey(null);
	}, []);

	const handleDeleteIt = useCallback(async (item) => {
		if (!item?._id) {
			return;
		}
		setDeletingKey(item.__key);
		const res = await safeFetch(
			`/noadmin/songs/${item._id}/permanently`,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not delete the song");
			setDeletingKey(null);
			return;
		}
		toast.success("Song deleted");
		setNewObjects((prev) => prev.filter((f) => f.__key !== item.__key));
		seenKeysRef.current.delete(item.__key);
		setCountAll((prev) =>
			typeof prev === "number" ? Math.max(0, prev - 1) : prev,
		);
		setDeletingKey(null);
	}, []);

	/* ------------------------------ Bulk actions ---------------------------- */

	const handleTrashAll = async () => {
		setTrashingAll(true);
		const res = await safeFetch(
			`/noadmin/songs/deleteall`,
			"PUT",
			"no-cache",
			{
				onModel: "Playlist",
				resourceId: object?._id,
			},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not trash all songs");
			setTrashingAll(false);
			return;
		}
		setNewObjects((prev) => prev.map((f) => ({ ...f, status: "trash" })));
		toast.success("All songs trashed");
		setTrashingAll(false);
	};

	const handleDeleteAll = async () => {
		setDeletingAll(true);
		const res = await safeFetch(
			`/noadmin/songs/deleteall/permanently`,
			"DELETE",
			"no-cache",
			{
				onModel: "Playlist",
				resourceId: object?._id,
			},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		if (isFailure(res)) {
			toast.error(res?.message || "Could not delete all songs");
			setDeletingAll(false);
			return;
		}
		setNewObjects([]);
		seenKeysRef.current.clear();
		setCountAll(0);
		setIsDirty(false);
		toast.success("All songs deleted");
		setDeletingAll(false);
	};

	/* ------------------------------- Derived list --------------------------- */

	const items = useMemo(
		() =>
			newobjects.map((file) => ({
				key: file.__key,
				raw: file,
				filename: file?.files?.audio_url?.location?.filename || "unknown",
				url: file?.files?.audio_url?.location?.secure_location || "",
				size: file?.files?.audio_url?.size,
				info: classifyFile(file?.files?.audio_url),
			})),
		[newobjects],
	);

	/* ------------------------------ Media elements -------------------------- */

	const pauseAllMedia = (exceptId) => {
		mediaElementsRef.current.forEach((element, id) => {
			if (id !== exceptId && !element.paused) {
				element.pause();
			}
		});
	};

	const registerMediaElement = (id, element) => {
		if (element) {
			mediaElementsRef.current.set(id, element);
		} else {
			mediaElementsRef.current.delete(id);
		}
	};

	/* -------------------------------- Uploading ----------------------------- */

	const insertUploadedFile = useCallback(
		(file) => {
			const key = buildKey(file, "upload");
			if (seenKeysRef.current.has(key)) {
				return;
			}
			seenKeysRef.current.add(key);
			const entry = { ...file, __key: key };
			setNewObjects((prev) =>
				prependNew ? [entry, ...prev] : [...prev, entry],
			);
			setCountAll((prev) => (typeof prev === "number" ? prev + 1 : prev));
		},
		[prependNew],
	);

	const addAndUploadFile = useCallback(
		(fileObj) => {
			if (!isMountedRef.current) {
				revokeObjectUrl(fileObj.url);
				return;
			}
			setFiles((prev) => [
				...prev,
				{ ...fileObj, uploading: true, progress: 0, uploadError: null },
			]);

			const { res, xhr } = uploadFileToServer(
				fileObj.blob,
				fileObj.name,
				(progress) => {
					if (!isMountedRef.current) return;
					setFiles((prev) =>
						prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)),
					);
				},
				auth,
				token,
				object,
			);

			uploadXhrsRef.current.set(fileObj.id, xhr);

			res
				.then(({ file: uploaded, record }) => {
					if (!isMountedRef.current) {
						return;
					}
					const serverObj = uploaded?.data || uploaded || {};
					const loc = serverObj.location || {};
					const recordData = record?.data || {};
					// With no remote URL the list keeps showing the local preview, so
					// that URL has to outlive the tray card.
					if (loc.secure_location) {
						revokeObjectUrl(fileObj.url);
					} else {
						keptUrlsRef.current.add(fileObj.url);
					}
					mediaElementsRef.current.delete(fileObj.id);
					setFiles((prev) => prev.filter((f) => f.id !== fileObj.id));

					const rawFormat =
						typeof serverObj.format_type === "string"
							? serverObj.format_type.toLowerCase()
							: "";
					const normalizedType = ["audio", "video", "image"].includes(rawFormat)
						? rawFormat
						: fileObj.type;

					insertUploadedFile({
						// The record's id, not the file's: the row actions call
						// /noadmin/songs/:id, which expects the record.
						_id: recordData._id,
						status: recordData.status || "draft",
						title: recordData.title || serverObj.title || fileObj.name,
						createdAt: serverObj.createdAt || new Date().toISOString(),
						files: {
							audio_url: {
								_id: serverObj._id,
								format_type: normalizedType,
								size:
									typeof serverObj.size === "number"
										? serverObj.size
										: fileObj.size,
								location: {
									filename: loc.filename || fileObj.name,
									secure_location: loc.secure_location || fileObj.url,
									public_id: loc.public_id,
								},
							},
						},
						album: serverObj.album,
					});
				})
				.catch((err) => {
					if (err?.name === "AbortError" || !isMountedRef.current) {
						return;
					}
					setFiles((prev) =>
						prev.map((f) =>
							f.id === fileObj.id
								? {
										...f,
										uploading: false,
										uploadError: err?.message || "Upload failed",
									}
								: f,
						),
					);
				})
				.finally(() => {
					uploadXhrsRef.current.delete(fileObj.id);
				});
		},
		[insertUploadedFile, revokeObjectUrl, auth, token, object],
	);

	const handleFileUpload = (e) => {
		// Copied before the input is reset, which empties its FileList.
		const selected = Array.from(e.target.files || []);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		const accepted = selected.filter(isAcceptedFile);
		if (accepted.length < selected.length) {
			toast.error("Only audio files can be uploaded here.");
		}
		// A File already is a Blob, so it is uploaded as-is.
		accepted.forEach((file) => {
			addAndUploadFile({
				id: generateId(),
				blob: file,
				url: createObjectUrl(file),
				name: file.name,
				type: getFileType(file.type),
				size: file.size,
			});
		});
	};

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const removeFile = (id) => {
		const xhr = uploadXhrsRef.current.get(id);
		if (xhr) {
			xhr.abort();
			uploadXhrsRef.current.delete(id);
		}
		mediaElementsRef.current.delete(id);
		// Revoked outside the state updater: updaters must stay pure (Strict Mode
		// runs them twice).
		const fileToRemove = uploadsRef.current.find((f) => f.id === id);
		if (fileToRemove) {
			revokeObjectUrl(fileToRemove.url);
		}
		setFiles((prev) => prev.filter((f) => f.id !== id));
	};

	/* ------------------------------- Permissions ---------------------------- */

	const grantAndStart = async (type) => {
		const ok = await startMediaStream(type);
		if (ok) {
			setPermissions((prev) => ({ ...prev, [type]: true }));
		}
		return ok;
	};

	const requestPermission = async (type) => {
		// Skip the modal if permission was already granted this session.
		if (permissions[type]) {
			startMediaStream(type);
			return;
		}
		// The in-memory flag resets on remount, but the browser persists the
		// grant. Query the Permissions API so an approved user isn't re-prompted.
		try {
			if (navigator.permissions?.query) {
				const states = await Promise.all(
					["microphone"].map((name) =>
						navigator.permissions
							.query({ name })
							.then((status) => status.state)
							.catch(() => "prompt"),
					),
				);
				if (states.every((state) => state === "granted")) {
					await grantAndStart(type);
					return;
				}
			}
		} catch {
			// Permissions API unsupported for these names — fall back to the modal.
		}
		if (!isMountedRef.current) {
			return;
		}
		setPendingMediaType(type);
		setShowPermissionModal(true);
	};

	const handlePermissionGranted = async () => {
		const type = pendingMediaType;
		setShowPermissionModal(false);
		setPendingMediaType(null);
		if (!type) {
			return;
		}
		await grantAndStart(type);
	};

	const handlePermissionDenied = () => {
		setShowPermissionModal(false);
		setPendingMediaType(null);
	};

	/* --------------------------------- Capture ------------------------------ */

	const startMediaStream = async (type) => {
		// Two quick clicks would otherwise open two streams, and the first one
		// would keep the microphone on with nothing left to stop it.
		if (startingMediaRef.current || streamRef.current) {
			return false;
		}
		startingMediaRef.current = true;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			// The user may have left the page while the browser prompt was open.
			if (!isMountedRef.current) {
				stream.getTracks().forEach((track) => track.stop());
				return false;
			}
			streamRef.current = stream;
			setupAudioVisualization(stream);
			setShowMicrophone(true);
			return true;
		} catch (err) {
			console.error("Error accessing media devices:", err);
			toast.error(
				"Could not access the microphone. Please check your browser permission settings.",
			);
			setPermissions((prev) => ({ ...prev, [type]: false }));
			return false;
		} finally {
			startingMediaRef.current = false;
		}
	};

	const setupAudioVisualization = (stream) => {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) {
			return;
		}
		// Browsers cap the number of live AudioContexts; close any previous one.
		audioContextRef.current?.close().catch(() => {});
		const audioContext = new AudioCtx();
		audioContextRef.current = audioContext;

		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		analyserRef.current = analyser;

		const source = audioContext.createMediaStreamSource(stream);
		source.connect(analyser);
	};

	useEffect(() => {
		if (!showMicrophone || !waveformRef.current || !analyserRef.current) {
			return;
		}

		const analyser = analyserRef.current;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const container = waveformRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = container.offsetWidth || 500;
		canvas.height = 80;
		canvas.style.width = "100%";
		canvas.style.height = "80px";
		container.replaceChildren(canvas);

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return () => container.replaceChildren();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, "#dc3545");
		gradient.addColorStop(1, "#ffc107");

		const draw = () => {
			animationFrameRef.current = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "#6c757d";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				const barHeight = (dataArray[i] / 255) * canvas.height;
				ctx.fillStyle = gradient;
				ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
				x += barWidth + 1;
			}
		};

		draw();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			container.replaceChildren();
		};
	}, [showMicrophone]);

	const stopAudioVisualization = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		audioContextRef.current?.close().catch(() => {});
		audioContextRef.current = null;
		analyserRef.current = null;
	};

	const startRecording = () => {
		if (!streamRef.current || mediaRecorderRef.current) {
			return;
		}
		let mediaRecorder;
		try {
			mediaRecorder = new MediaRecorder(streamRef.current);
		} catch (err) {
			console.error("Could not start MediaRecorder:", err);
			toast.error("Recording is not supported in this browser.");
			return;
		}
		// Captured per recording, so a late onstop can't mix up chunks.
		const chunks = [];
		chunksRef.current = chunks;
		mediaRecorderRef.current = mediaRecorder;

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};

		mediaRecorder.onstop = () => {
			if (mediaRecorderRef.current === mediaRecorder) {
				mediaRecorderRef.current = null;
			}
			chunksRef.current = [];
			if (!isMountedRef.current) {
				return;
			}
			setIsRecording(false);
			// Use the format the browser actually produced (Safari records mp4).
			const mimeType = mediaRecorder.mimeType || "audio/webm";
			const blob = new Blob(chunks, { type: mimeType });
			chunks.length = 0;
			if (blob.size === 0) {
				return;
			}
			const ext = mimeType.includes("mp4")
				? "m4a"
				: mimeType.includes("ogg")
					? "ogg"
					: "webm";
			addAndUploadFile({
				id: generateId(),
				blob,
				url: createObjectUrl(blob),
				name: `audio_${Date.now()}.${ext}`,
				type: "audio",
				size: blob.size,
			});
		};

		mediaRecorder.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		const rec = mediaRecorderRef.current;
		if (rec && rec.state !== "inactive") {
			rec.stop();
		}
		setIsRecording(false);
	};

	const closeMediaStream = () => {
		// Stop the recorder before its tracks so the final chunk is flushed and
		// the recording is still saved.
		stopRecording();
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		stopAudioVisualization();
		setShowMicrophone(false);
	};

	/* ----------------------------- Reorder uploads -------------------------- */

	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	// dragover fires continuously; only update state when the index changes.
	const handleDragOver = useCallback((e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex((prev) => (prev === index ? prev : index));
	}, []);

	// dragleave also fires when the pointer moves onto a child of the card;
	// ignore those so the highlight doesn't flicker.
	const handleDragLeave = (e) => {
		if (e.currentTarget.contains(e.relatedTarget)) {
			return;
		}
		setDragOverIndex(null);
	};

	const handleDrop = useCallback(
		(e, dropIndex) => {
			e.preventDefault();
			if (
				draggedIndex === null ||
				draggedIndex === dropIndex ||
				dropIndex >= uploadsRef.current.length
			) {
				setDraggedIndex(null);
				setDragOverIndex(null);
				return;
			}
			setFiles((prev) => {
				const next = [...prev];
				const [moved] = next.splice(draggedIndex, 1);
				next.splice(dropIndex, 0, moved);
				return next;
			});
			setDraggedIndex(null);
			setDragOverIndex(null);
		},
		[draggedIndex],
	);

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	/* ------------------------------ Reorder list ---------------------------- */

	const handleItemDragStart = (e, index) => {
		setItemDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleItemDragOver = useCallback((e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setItemDragOverIndex((prev) => (prev === index ? prev : index));
	}, []);

	const handleItemDragLeave = (e) => {
		if (e.currentTarget.contains(e.relatedTarget)) {
			return;
		}
		setItemDragOverIndex(null);
	};

	const handleItemDrop = useCallback(
		(e, dropIndex) => {
			e.preventDefault();
			if (itemDraggedIndex === null || itemDraggedIndex === dropIndex) {
				setItemDraggedIndex(null);
				setItemDragOverIndex(null);
				return;
			}
			setNewObjects((prev) => {
				if (dropIndex >= prev.length) {
					return prev;
				}
				const next = [...prev];
				const [moved] = next.splice(itemDraggedIndex, 1);
				next.splice(dropIndex, 0, moved);
				return next;
			});
			setIsDirty(true);
			setSuccess("");
			setSaveError("");
			setItemDraggedIndex(null);
			setItemDragOverIndex(null);
		},
		[itemDraggedIndex],
	);

	const handleItemDragEnd = () => {
		setItemDraggedIndex(null);
		setItemDragOverIndex(null);
	};

	const handleSave = async () => {
		if (saving) {
			return;
		}
		setSaving(true);
		setSaveError("");
		setSuccess("");

		// Only the loaded pages are on screen; number them from where they start.
		const offset = (initialPage - 1) * limit;
		const order = items
			.filter((it) => it.raw?._id)
			.map((it, idx) => ({
				_id: it.raw._id,
				orderingNumber: offset + idx + 1,
			}));
		const res = await safeFetch(
			`/noadmin/songs/${object?._id}/updateorder`,
			"PUT",
			"no-cache",
			{ order },
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) {
			return;
		}
		setSaving(false);
		if (isFailure(res)) {
			const message = res?.message || "Could not save the new order";
			setSaveError(message);
			toast.error(message);
			return;
		}
		setIsDirty(false);
		setSuccess("Order saved successfully.");
	};

	/* --------------------------------- Search ------------------------------- */

	const [keyword, setKeyword] = useState("");
	const [debouncedKeyword, setDebouncedKeyword] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(keyword.trim());
		}, 400);
		return () => clearTimeout(timer);
	}, [keyword]);

	const searchData = (e) => {
		e.preventDefault();
		setDebouncedKeyword(keyword.trim());
	};

	const displayedItems = useMemo(() => {
		if (!debouncedKeyword) {
			return items;
		}
		const needle = debouncedKeyword.toLowerCase();
		return items.filter((item) =>
			(item?.raw?.title || "").toLowerCase().includes(needle),
		);
	}, [items, debouncedKeyword]);

	/* --------------------------------- Render ------------------------------- */

	const permissionLabel = "microphone";
	const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
	const countBadge = (
		<span className="badge bg-light text-dark">
			{items.length}
			{countAll != null ? ` / ${countAll}` : ""} file
			{items.length !== 1 ? "s" : ""}
		</span>
	);

	return (
		<>
			{/* FILE UPLOADER */}
			<div className="mb-1">
				{showPermissionModal && (
					<div
						className="modal show d-block"
						tabIndex="-1"
						role="dialog"
						aria-modal="true"
						aria-labelledby="permission-modal-title"
						style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="permission-modal-title">
										Permission Required
									</h5>
								</div>
								<div className="modal-body">
									<p>
										This application would like to access your{" "}
										<strong>{permissionLabel}</strong>.
									</p>
									<p className="text-muted mb-0">
										Would you like to grant access?
									</p>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={handlePermissionDenied}
									>
										Deny
									</button>
									<button
										type="button"
										className="btn btn-primary"
										onClick={handlePermissionGranted}
									>
										Allow
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className="card rounded-0 mb-1">
					<div className="card-header">
						<h4 className="mb-0 d-flex align-items-center gap-2">
							<i aria-hidden className="fa-solid fa-upload" />
							Songs Manager
						</h4>
					</div>
					<div className="card-body">
						<div className="row g-3 mb-3">
							<div className="col-12 col-md-4">
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileUpload}
									accept={ACCEPTED_FILE_TYPES}
									multiple
									className="d-none"
									id="fileInput"
								/>
								<button
									type="button"
									className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={openFilePicker}
								>
									<i aria-hidden className="fa-solid fa-upload" />
									Upload Files
								</button>
							</div>

							<div className="col-12 col-md-4">
								<button
									type="button"
									className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => requestPermission("audio")}
									disabled={showMicrophone}
								>
									<i aria-hidden className="fa-solid fa-microphone" />
									Open Microphone
								</button>
							</div>

							<div className="col-12 col-md-4">
								<div className="bg-light rounded p-2 text-center">
									<small className="text-muted">
										{files.length} file{files.length !== 1 ? "s" : ""} •{" "}
										{formatFileSize(totalSize)}
									</small>
								</div>
							</div>
						</div>

						{/* Live capture panel */}
						{showMicrophone && (
							<div className="card mb-3 border-2 border-primary">
								<div className="card-body">
									<div className="text-center py-4">
										<div
											className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${
												isRecording ? "bg-danger" : "bg-secondary"
											}`}
											style={{ width: "80px", height: "80px" }}
										>
											<i
												aria-hidden
												className="fa-solid fa-microphone fa-3x text-white"
											/>
										</div>
										<div
											ref={waveformRef}
											aria-hidden
											className="mb-3 mx-auto rounded border border-secondary"
											style={{
												maxWidth: "500px",
												height: "80px",
												backgroundColor: "#f8f9fa",
											}}
										/>
										<p className="mt-2 mb-0" aria-live="polite">
											{isRecording ? (
												<span className="text-danger fw-bold">
													Recording...
												</span>
											) : (
												<span>Microphone ready</span>
											)}
										</p>
									</div>

									<div className="d-flex flex-wrap justify-content-center gap-2">
										{!isRecording ? (
											<button
												type="button"
												className="btn btn-danger btn-sm"
												onClick={startRecording}
											>
												<i
													aria-hidden
													className="fa-solid fa-play align-middle me-1"
												/>
												Start Recording
											</button>
										) : (
											<button
												type="button"
												className="btn btn-dark btn-sm"
												onClick={stopRecording}
											>
												<i
													aria-hidden
													className="fa-solid fa-stop align-middle me-1"
												/>
												Stop Recording
											</button>
										)}
										<button
											type="button"
											className="btn btn-secondary btn-sm"
											onClick={closeMediaStream}
										>
											<i
												aria-hidden
												className="fa-solid fa-xmark align-middle me-1"
											/>
											Close
										</button>
									</div>
								</div>
							</div>
						)}

						{files.length === 0 ? (
							<div className="text-center py-5 rounded admin-multimedia-manager">
								<p className="mb-0">
									No files yet. Upload or record audio to get started.
								</p>
								<small>Drag files to reorder them</small>
							</div>
						) : (
							<div className="d-flex flex-nowrap gap-3 overflow-auto pb-3 scroll-thin">
								{files.map((file, index) => (
									<div
										key={file.id}
										className="flex-shrink-0"
										style={{ width: "280px" }}
										draggable={!file.uploading}
										onDragStart={(e) => handleDragStart(e, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, index)}
										onDragEnd={handleDragEnd}
									>
										<div
											className={`card h-100 position-relative ${
												draggedIndex === index ? "opacity-50" : ""
											} ${
												dragOverIndex === index ? "border-primary border-2" : ""
											}`}
											style={{ cursor: file.uploading ? "wait" : "grab" }}
										>
											<div className="card-header d-flex justify-content-between align-items-center py-2">
												<div className="d-flex align-items-center gap-2">
													<span className="badge bg-secondary">
														{index + 1}
													</span>
													<span
														className={
															file.type === "audio"
																? "text-warning"
																: "text-info"
														}
													>
														{getMediaIcon(file.type)}
													</span>
												</div>
												{!file.uploading && (
													<button
														type="button"
														className="btn btn-sm btn-outline-danger"
														onClick={() => removeFile(file.id)}
														title="Remove file"
														aria-label={`Remove ${file.name}`}
													>
														<i
															aria-hidden
															className="fa-regular fa-trash-can"
														/>
													</button>
												)}
											</div>
											<div className="card-body p-2 position-relative">
												<div
													style={
														file.uploading
															? { filter: "blur(4px)", pointerEvents: "none" }
															: null
													}
												>
													{file.type === "audio" && (
														<div
															className="d-flex align-items-center p-1 admin-multimedia-manager-audio-file"
															style={{ height: "150px" }}
														>
															<audio
																ref={(el) => registerMediaElement(file.id, el)}
																src={file.url}
																controls
																preload="metadata"
																className="w-100"
																onPlay={() => pauseAllMedia(file.id)}
															/>
														</div>
													)}
												</div>
												{file.uploading && (
													<div
														className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
														style={{
															backgroundColor: "rgba(255,255,255,0.55)",
														}}
													>
														<span className="fw-bold fs-3 text-primary">
															{file.progress}%
														</span>
														<small className="text-muted">Uploading...</small>
													</div>
												)}
											</div>
											<div className="card-footer py-2">
												<p
													className="mb-1 text-truncate small fw-medium"
													title={file.name}
												>
													{file.name}
												</p>
												<div className="d-flex justify-content-between align-items-center">
													<small>{formatFileSize(file.size)}</small>
													{file.uploadError && (
														<small
															className="text-danger"
															title={file.uploadError}
														>
															Upload failed
														</small>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						<div className="mt-4 p-3 rounded admin-multimedia-manager">
							<h6 className="fw-bold mb-2">Instructions</h6>
							<ul className="mb-0 small">
								<li>Upload audio files using the upload button</li>
								<li>Use the microphone to record audio</li>
								<li>Drag and drop cards to reorder your media files</li>
								<li>Click the trash icon to remove individual files</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* GET API ENDPOINT ERRORS */}
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
				<div className="alert alert-info rounded-0 mb-0" role="alert">
					No files were returned from the API.
				</div>
			)}

			{items.length > 0 && (
				<>
					<div className="card rounded-0 mb-1">
						<div className="card-header">
							<div className="float-start">
								<form
									onSubmit={searchData}
									className="d-none d-md-block"
									role="search"
								>
									<label htmlFor="keyword" className="visually-hidden">
										Search by title
									</label>
									<input
										id="keyword"
										name="keyword"
										value={keyword}
										onChange={(e) => setKeyword(e.target.value)}
										type="search"
										className="form-control"
										placeholder="Search by title"
									/>
								</form>
							</div>
							<div className="float-end my-1">
								<div className="btn-group">
									{isDirty && (
										<button
											type="button"
											className="btn btn-success btn-sm"
											onClick={handleSave}
											disabled={saving}
										>
											{saving ? (
												<>
													<span
														className="spinner-border spinner-border-sm me-1"
														role="status"
														aria-hidden="true"
													/>
													Saving...
												</>
											) : (
												<>
													<i
														aria-hidden
														className="fa-solid fa-floppy-disk me-1"
													/>
													Save Order
												</>
											)}
										</button>
									)}
									<button
										type="button"
										className="btn btn-danger btn-sm"
										onClick={handleTrashAll}
										disabled={trashingAll}
									>
										{trashingAll ? "..." : "Trash all"}
									</button>
									<button
										type="button"
										className="btn btn-dark btn-sm"
										onClick={handleDeleteAll}
										disabled={deletingAll}
									>
										{deletingAll ? "..." : "Delete all permanently"}
									</button>
								</div>
							</div>
						</div>
						<div className="card-body">
							<small className="text-muted">
								{debouncedKeyword
									? "Clear the search to reorder."
									: "Drag the cards to reorder, then save your changes."}
							</small>
						</div>
					</div>
					{/* Dismissed through state: Bootstrap's data-bs-dismiss would remove
              nodes React still owns. */}
					{saveError && (
						<div
							className="alert alert-danger alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							{saveError}
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => setSaveError("")}
							/>
						</div>
					)}
					{success && (
						<div
							className="alert alert-success alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							{success}
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => setSuccess("")}
							/>
						</div>
					)}
					{debouncedKeyword && displayedItems.length === 0 && (
						<div
							className="alert alert-info alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							No objects match &quot;{debouncedKeyword}&quot;.
							<button
								type="button"
								className="btn-close"
								aria-label="Clear search"
								onClick={() => {
									setKeyword("");
									setDebouncedKeyword("");
								}}
							/>
						</div>
					)}
					<div className="row g-3">
						{displayedItems.map((item, index) => (
							<Single
								key={item.key}
								index={index}
								object={item}
								handleDraft={handleDraftIt}
								handlePublish={handlePublishIt}
								handleTrash={handleTrashIt}
								handleSchedule={handleScheduleIt}
								handleDelete={handleDeleteIt}
								isDrafting={draftingKey === item.key}
								isPublishing={publishingKey === item.key}
								isTrashing={trashingKey === item.key}
								isScheduling={schedulingKey === item.key}
								isDeleting={deletingKey === item.key}
								dragProps={
									debouncedKeyword
										? DRAG_DISABLED
										: {
												draggable: true,
												onDragStart: (e) => handleItemDragStart(e, index),
												onDragOver: (e) => handleItemDragOver(e, index),
												onDragLeave: handleItemDragLeave,
												onDrop: (e) => handleItemDrop(e, index),
												onDragEnd: handleItemDragEnd,
												style: { cursor: "grab" },
												className: `${
													itemDraggedIndex === index ? "opacity-50" : ""
												} ${
													itemDragOverIndex === index
														? "border border-primary border-2 rounded"
														: ""
												}`,
											}
								}
							/>
						))}
					</div>
				</>
			)}

			{/* Sentinel + status row */}
			<div ref={sentinelRef} className="text-center py-4">
				{loading && (
					<div className="d-inline-flex align-items-center gap-2 text-muted">
						<div
							className="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						<span>Loading more files...</span>
						<br />
						{!error && countBadge}
					</div>
				)}
				{!loading && !hasMore && items.length > 0 && (
					<>
						<small className="text-muted">No more files to load.</small>
						<br />
						{!error && countBadge}
					</>
				)}
			</div>
		</>
	);
};

export default SongsMediaManager;
