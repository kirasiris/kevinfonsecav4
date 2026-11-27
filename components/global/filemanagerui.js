"use client";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import {
	FILES_PER_PAGE,
	SEARCH_DELAY_MS,
	buildKey,
	fileNameOf,
	fileUrlOf,
	idOf,
	isEmptyPage,
	isFailure,
	keyItems,
	kindOf,
	positiveNumber,
	safeFetch,
	seedFromObjects,
	toFileObject,
} from "@/helpers/filemanagerhelpers";

export function useIsMounted() {
	const isMountedRef = useRef(false);
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	return isMountedRef;
}

let openModalCount = 0;

export function BootstrapModal({ title, icon, size = "", onClose, children }) {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onCloseRef.current();
		}
		document.addEventListener("keydown", onKey);
		openModalCount++;
		document.body.classList.add("modal-open");
		return () => {
			document.removeEventListener("keydown", onKey);
			openModalCount = Math.max(0, openModalCount - 1);
			if (openModalCount === 0) document.body.classList.remove("modal-open");
		};
	}, []);

	return (
		<>
			<div
				className="modal fade show d-block"
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-label={title}
			>
				<div className={"modal-dialog modal-dialog-scrollable " + size}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								<i
									className={"fa-solid fa-" + icon + " align-middle me-2"}
									aria-hidden="true"
								/>
								{title}
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={onClose}
							></button>
						</div>
						{children}
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show" onClick={onClose}></div>
		</>
	);
}

export function ModalSpinner({ label }) {
	return (
		<div className="text-center py-5 text-body-secondary">
			<div className="spinner-border" role="status">
				<span className="visually-hidden">{label}</span>
			</div>
			<p className="mt-2 mb-0">{label}</p>
		</div>
	);
}

export function Pagination({
	page,
	totalPages,
	onPage,
	label,
	disabled = false,
}) {
	const total = Math.max(1, Number(totalPages) || 1);
	const current = Math.min(Math.max(1, Number(page) || 1), total);

	if (total <= 1) return <span aria-hidden="true" />;

	const span = 2;
	const wanted = new Set([1, total]);
	for (let p = current - span; p <= current + span; p++) {
		if (p >= 1 && p <= total) wanted.add(p);
	}
	const shown = Array.from(wanted).sort((a, b) => a - b);

	const items = [];
	let previous = 0;
	for (const p of shown) {
		if (p - previous > 1) items.push({ gap: true, key: "gap-" + p });
		items.push({ page: p, key: p });
		previous = p;
	}

	const prevDisabled = disabled || current === 1;
	const nextDisabled = disabled || current === total;

	return (
		<nav aria-label={label}>
			<ul className="pagination pagination-sm mb-0 flex-wrap">
				<li className={"page-item" + (prevDisabled ? " disabled" : "")}>
					<button
						type="button"
						className="page-link"
						disabled={prevDisabled}
						onClick={() => onPage(current - 1)}
					>
						<span aria-hidden="true">&lsaquo;</span>
						<span className="visually-hidden">Previous page</span>
					</button>
				</li>
				{items.map((item) =>
					item.gap ? (
						<li key={item.key} className="page-item disabled">
							<span className="page-link">&hellip;</span>
						</li>
					) : (
						<li
							key={item.key}
							className={
								"page-item" +
								(item.page === current ? " active" : "") +
								(disabled && item.page !== current ? " disabled" : "")
							}
						>
							<button
								type="button"
								className="page-link"
								disabled={disabled && item.page !== current}
								aria-current={item.page === current ? "page" : undefined}
								onClick={() => onPage(item.page)}
							>
								{item.page}
							</button>
						</li>
					),
				)}
				<li className={"page-item" + (nextDisabled ? " disabled" : "")}>
					<button
						type="button"
						className="page-link"
						disabled={nextDisabled}
						onClick={() => onPage(current + 1)}
					>
						<span aria-hidden="true">&rsaquo;</span>
						<span className="visually-hidden">Next page</span>
					</button>
				</li>
			</ul>
		</nav>
	);
}

const EMPTY_FILE_STATE = {
	items: [],
	page: 1,
	totalPages: 1,
	keyword: "",
	loading: false,
	error: "",
};

export function useFileBrowser({ formatType = null, kinds = null } = {}) {
	const isMountedRef = useIsMounted();
	const [showFiles, setShowFiles] = useState(false);
	const [fileSelection, setFileSelection] = useState(null);
	const [fileSearch, setFileSearch] = useState("");
	const [fileState, setFileState] = useState(EMPTY_FILE_STATE);
	const [fileKind, setFileKind] = useState(() =>
		kinds ? Object.keys(kinds)[0] : null,
	);

	const requestIdRef = useRef(0);

	const keywordRef = useRef("");
	const searchTimerRef = useRef(0);

	const kindRef = useRef(fileKind);

	useEffect(
		() => () => {
			requestIdRef.current++;
			clearTimeout(searchTimerRef.current);
		},
		[],
	);

	const loadFiles = useCallback(
		async (page, keyword = keywordRef.current) => {
			const requestId = ++requestIdRef.current;
			keywordRef.current = keyword;
			setFileState((s) => ({ ...s, page, keyword, loading: true, error: "" }));
			const query =
				`page=${page}&limit=${FILES_PER_PAGE}` +
				(kinds
					? `&${kinds[kindRef.current].query}`
					: formatType
						? `&format_type=${encodeURIComponent(formatType)}`
						: "") +
				(keyword ? `&keyword=${encodeURIComponent(keyword)}` : "");
			const json = await safeFetch(
				`/global/files?${query}`,
				"GET",
				"no-cache",
				{},
				undefined,
				false,
				false,
			);
			if (!isMountedRef.current || requestId !== requestIdRef.current) return;
			if (Array.isArray(json?.data)) {
				setFileState({
					items: json.data,
					page: json.pagination?.current || page,
					totalPages: json.pagination?.totalpages || 1,
					keyword,
					loading: false,
					error: "",
				});
				return;
			}
			if (isEmptyPage(json)) {
				if (page > 1) {
					loadFiles(1, keyword);
					return;
				}
				setFileState({ ...EMPTY_FILE_STATE, keyword });
				return;
			}
			setFileState((s) => ({
				...s,
				loading: false,
				error: json?.message || "Failed to load files",
			}));
		},
		[formatType, kinds, isMountedRef],
	);

	const goToPage = (page) => {
		if (page === fileState.page && !fileState.error) return;
		setFileSelection(null);
		loadFiles(page);
	};

	const openFileManager = (kind) => {
		clearTimeout(searchTimerRef.current);
		const nextKind = kinds && kinds[kind] ? kind : kindRef.current;
		const sameKind = nextKind === kindRef.current;
		kindRef.current = nextKind;
		setFileKind(nextKind);
		setFileSelection(null);
		setFileSearch("");
		setShowFiles(true);
		loadFiles(sameKind ? fileState.page : 1, "");
	};

	const switchFileKind = (kind) => {
		if (!kinds || !kinds[kind] || kind === kindRef.current) return;
		clearTimeout(searchTimerRef.current);
		kindRef.current = kind;
		setFileKind(kind);
		setFileSelection(null);
		loadFiles(1, fileSearch.trim());
	};

	const closeFileManager = useCallback(() => {
		clearTimeout(searchTimerRef.current);
		requestIdRef.current++;
		setFileState((s) => (s.loading ? { ...s, loading: false } : s));
		setFileSelection(null);
		setShowFiles(false);
	}, []);

	const runSearch = (value) => {
		clearTimeout(searchTimerRef.current);
		const term = value.trim();
		if (term === keywordRef.current) return;
		setFileSelection(null);
		loadFiles(1, term);
	};

	const onSearchChange = (e) => {
		const value = e.target.value;
		setFileSearch(value);
		clearTimeout(searchTimerRef.current);
		searchTimerRef.current = setTimeout(() => {
			if (isMountedRef.current) runSearch(value);
		}, SEARCH_DELAY_MS);
	};

	const onSearchKeyDown = (e) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		if (e.nativeEvent.isComposing || e.keyCode === 229) return;
		runSearch(e.currentTarget.value);
	};

	const toggleFileSelection = (item) => {
		if (!fileUrlOf(item)) return;
		setFileSelection((prev) =>
			prev && idOf(prev) === idOf(item) ? null : item,
		);
	};

	const visibleFiles = fileState.items.filter((item) => fileUrlOf(item));

	return {
		showFiles,
		fileState,
		fileSearch,
		fileSelection,
		fileKind,
		kinds,
		visibleFiles,
		loadFiles,
		goToPage,
		openFileManager,
		switchFileKind,
		closeFileManager,
		onSearchChange,
		onSearchKeyDown,
		toggleFileSelection,
	};
}

const thumbIconOf = (kind) =>
	kind === "video"
		? "fa-film"
		: kind === "audio" || kind === "ogg"
			? "fa-music"
			: kind === "pdf"
				? "fa-file-pdf"
				: "fa-file";

export function FileBrowserModal({
	browser,
	title,
	noun = "",
	icon = "",
	currentId = "",
	onApply,
}) {
	const {
		showFiles,
		fileState,
		fileSearch,
		fileSelection,
		fileKind,
		kinds,
		visibleFiles,
		loadFiles,
		goToPage,
		switchFileKind,
		closeFileManager,
		onSearchChange,
		onSearchKeyDown,
		toggleFileSelection,
	} = browser;
	if (!showFiles || typeof document === "undefined") return null;

	const activeKind = kinds ? kinds[fileKind] : null;
	const kindNoun = activeKind ? activeKind.noun : noun;
	const kindIcon = activeKind ? activeKind.icon : icon;
	const label = kindNoun ? `${kindNoun} files` : "files";
	const selectedId = idOf(fileSelection);

	return createPortal(
		<BootstrapModal
			title={title}
			icon="folder-open"
			size="modal-xl"
			onClose={closeFileManager}
		>
			<div className="modal-body">
				<div className="d-flex flex-wrap gap-2 mb-3">
					{kinds && (
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="File type"
						>
							{Object.keys(kinds).map((kind) => (
								<button
									key={kind}
									type="button"
									className={
										"btn " +
										(fileKind === kind ? "btn-primary" : "btn-outline-primary")
									}
									aria-pressed={fileKind === kind}
									onClick={() => switchFileKind(kind)}
								>
									<i
										className={"fa-solid me-1 " + kinds[kind].icon}
										aria-hidden="true"
									/>
									{kinds[kind].label}
								</button>
							))}
						</div>
					)}
					<div className="input-group input-group-sm flex-grow-1 w-auto">
						<span className="input-group-text">
							<i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
						</span>
						<input
							type="search"
							className="form-control"
							placeholder={`Search ${label} by name...`}
							aria-label={`Search ${label} by name`}
							value={fileSearch}
							onChange={onSearchChange}
							onKeyDown={onSearchKeyDown}
						/>
					</div>
				</div>
				{fileState.loading && <ModalSpinner label="Loading files..." />}
				{!fileState.loading && fileState.error && (
					<div
						className="alert alert-danger d-flex align-items-center justify-content-between gap-2"
						role="alert"
					>
						<span>{fileState.error}</span>
						<button
							type="button"
							className="btn btn-sm btn-outline-danger"
							onClick={() => loadFiles(fileState.page)}
						>
							Retry
						</button>
					</div>
				)}
				{!fileState.loading && !fileState.error && (
					<div className="row g-3" role="radiogroup" aria-label="Files">
						{visibleFiles.length === 0 && (
							<div className="col-12 text-center text-body-secondary py-4">
								{fileState.keyword
									? `No ${label} match \u201C${fileState.keyword}\u201D.`
									: `You don't have any ${label} yet.`}
							</div>
						)}
						{visibleFiles.map((item, i) => {
							const url = fileUrlOf(item);
							const itemName = fileNameOf(item);
							const itemKind = kindOf(item);
							const itemId = idOf(item);
							const isSelected = !!selectedId && selectedId === itemId;
							const isCurrent = !!currentId && currentId === itemId;
							return (
								<div
									className="col-6 col-md-4 col-lg-3"
									key={itemId || url || i}
								>
									<div
										className={
											"card file-card h-100 shadow-sm position-relative" +
											(isSelected ? " border-primary border-2" : "")
										}
										role="radio"
										aria-checked={isSelected}
										aria-label={"Select " + itemName}
										tabIndex={0}
										onClick={() => toggleFileSelection(item)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												toggleFileSelection(item);
											}
										}}
										onDoubleClick={() => onApply(item)}
									>
										{isSelected && (
											<span className="badge text-bg-primary position-absolute top-0 end-0 m-2 z-1">
												<i className="fa-solid fa-check" aria-hidden="true" />
											</span>
										)}
										{!isSelected && isCurrent && (
											<span className="badge text-bg-secondary position-absolute top-0 end-0 m-2 z-1">
												Current
											</span>
										)}
										{itemKind === "image" ? (
											<img
												src={url || "/placeholder.svg"}
												alt={itemName}
												className="file-thumb"
												style={{ height: 120, objectFit: "cover" }}
												loading="lazy"
												decoding="async"
											/>
										) : (
											<div
												className="file-thumb d-flex align-items-center justify-content-center bg-body-tertiary"
												style={{ height: 120 }}
											>
												<i
													aria-hidden="true"
													className={
														"fa-solid fs-1 text-body-secondary " +
														thumbIconOf(itemKind)
													}
												/>
											</div>
										)}
										<div className="card-body p-2">
											<p className="small text-truncate mb-0" title={itemName}>
												{itemName}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<div className="modal-footer justify-content-between">
				<Pagination
					page={fileState.page}
					totalPages={fileState.totalPages}
					onPage={goToPage}
					disabled={fileState.loading}
					label="File pages"
				/>
				<div className="d-flex align-items-center gap-2">
					{fileSelection && (
						<small className="text-body-secondary text-truncate d-none d-md-inline">
							{kindIcon && (
								<i className={"fa-solid me-1 " + kindIcon} aria-hidden="true" />
							)}
							{fileNameOf(fileSelection)}
						</small>
					)}
					<button
						type="button"
						className="btn btn-primary btn-sm"
						disabled={!fileSelection}
						onClick={() => onApply(fileSelection)}
					>
						Use file
					</button>
					<button
						type="button"
						className="btn btn-secondary btn-sm"
						onClick={closeFileManager}
					>
						Close
					</button>
				</div>
			</div>
		</BootstrapModal>,
		document.body,
	);
}

const KIND_LABELS = {
	video: { noun: "video", icon: "fa-film" },
	audio: { noun: "audio", icon: "fa-music" },
};

export function MediaFilePicker({
	name,
	kind,
	label,
	initialFile = null,
	allowClear = true,
}) {
	const fieldId = useId();
	const wrapperRef = useRef(null);
	const { noun, icon } = KIND_LABELS[kind] || KIND_LABELS.video;
	const browser = useFileBrowser({ formatType: kind });

	const seed = toFileObject(initialFile);
	const seedId = idOf(seed);
	const seedRef = useRef(seed);
	seedRef.current = seed;

	const touchedRef = useRef(false);
	const [chosenFile, setChosenFile] = useState(seed);

	useEffect(() => {
		if (touchedRef.current) return;
		setChosenFile(seedRef.current);
	}, [seedId]);

	useEffect(() => {
		const form = wrapperRef.current?.closest("form");
		if (!form) return;
		const onReset = () => {
			touchedRef.current = false;
			setChosenFile(seedRef.current);
		};
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, []);

	const applyFile = (item) => {
		if (!item) return;
		touchedRef.current = true;
		setChosenFile(item);
		browser.closeFileManager();
	};

	const clearFile = () => {
		touchedRef.current = true;
		setChosenFile(null);
	};

	const chosenId = idOf(chosenFile);
	const chosenUrl = fileUrlOf(chosenFile);

	return (
		<div ref={wrapperRef}>
			<label htmlFor={fieldId} className="form-label">
				{label}
			</label>

			{chosenUrl && kind === "video" && (
				<video
					key={chosenId}
					src={chosenUrl}
					controls
					preload="metadata"
					className="d-block w-100 rounded mb-2 bg-body-tertiary"
					style={{ maxHeight: 360 }}
				/>
			)}
			{chosenUrl && kind === "audio" && (
				<audio
					key={chosenId}
					src={chosenUrl}
					controls
					preload="metadata"
					className="d-block w-100 mb-2"
				/>
			)}

			<div className="input-group mb-3">
				<input
					id={fieldId}
					type="text"
					className="form-control"
					value={chosenFile ? fileNameOf(chosenFile) : ""}
					placeholder={`No ${noun} file selected`}
					readOnly
				/>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() => browser.openFileManager()}
					title={`Pick a ${noun} file from your files`}
				>
					<i className="fa-solid fa-folder-open me-1" aria-hidden="true" />
					Files
				</button>
				{allowClear && chosenFile && (
					<button
						type="button"
						className="btn btn-outline-secondary"
						onClick={clearFile}
					>
						<i className="fa-solid fa-xmark align-middle" aria-hidden="true" />
						<span className="visually-hidden">Clear {noun} file</span>
					</button>
				)}
			</div>
			<input type="hidden" name={name} value={chosenId} readOnly />

			<FileBrowserModal
				browser={browser}
				title={`File Manager — ${label}`}
				noun={noun}
				icon={icon}
				currentId={chosenId}
				onApply={applyFile}
			/>
		</div>
	);
}

export function useInfiniteList({
	objects,
	searchParams,
	endpoint,
	query = "",
	defaultSort,
	failMessage = "Failed to retrieve files",
}) {
	const initialPage = useMemo(
		() => positiveNumber(searchParams?.page, objects?.pagination?.current) || 1,
		[searchParams?.page, objects?.pagination?.current],
	);
	const limit = useMemo(
		() =>
			positiveNumber(searchParams?.limit, objects?.pagination?.next?.limit) ||
			32,
		[searchParams?.limit, objects?.pagination?.next?.limit],
	);
	const sort = searchParams?.sort || defaultSort;
	const prependNew = !sort || sort.startsWith("-");
	const hasSsrPayload = Array.isArray(objects?.data);

	const isMountedRef = useIsMounted();
	const seenKeysRef = useRef(null);
	if (seenKeysRef.current === null) {
		seenKeysRef.current = new Set();
	}
	const activeRequestRef = useRef(null);
	const sentinelRef = useRef(null);

	const [newobjects, setNewObjects] = useState(() =>
		seedFromObjects(objects, initialPage, seenKeysRef.current),
	);
	const [lastLoadedPage, setLastLoadedPage] = useState(
		hasSsrPayload ? initialPage : initialPage - 1,
	);
	const [countAll, setCountAll] = useState(
		typeof objects?.countAll === "number" ? objects.countAll : null,
	);
	const [hasMore, setHasMore] = useState(() => {
		if (objects?.pagination?.next?.page) return true;
		const total = Number(objects?.pagination?.totalpages);
		if (Number.isFinite(total)) return initialPage < total;
		return !hasSsrPayload;
	});
	const [loading, setLoading] = useState(!hasSsrPayload);
	const [error, setError] = useState(null);

	const fetchPage = useCallback(
		async (pageToLoad) => {
			if (activeRequestRef.current) return;
			const controller = new AbortController();
			activeRequestRef.current = controller;
			setLoading(true);
			setError(null);

			try {
				const res = await safeFetch(
					`${endpoint}?${
						query ? query + "&" : ""
					}page=${pageToLoad}&limit=${limit}&sort=${sort}`,
					"GET",
					"no-cache",
					{},
					undefined,
					false,
					false,
				);
				if (controller.signal.aborted || !isMountedRef.current) return;
				if (isEmptyPage(res)) {
					setHasMore(false);
					setLastLoadedPage(pageToLoad);
					return;
				}
				if (!res?.success) {
					const message = res?.message || failMessage;
					setError(message);
					toast.error(message);
					return;
				}

				const rawList = Array.isArray(res?.data) ? res.data : [];
				const fresh = keyItems(rawList, pageToLoad, seenKeysRef.current);
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
					if (isMountedRef.current) setLoading(false);
				}
			}
		},
		[endpoint, query, limit, sort, failMessage, isMountedRef],
	);

	const abortActiveFetch = useCallback(() => {
		activeRequestRef.current?.abort();
		activeRequestRef.current = null;
		setLoading(false);
	}, []);

	useEffect(
		() => () => {
			activeRequestRef.current?.abort();
			activeRequestRef.current = null;
		},
		[],
	);

	useEffect(() => {
		if (hasSsrPayload) return;
		fetchPage(initialPage);
		return abortActiveFetch;
	}, [hasSsrPayload, initialPage, fetchPage, abortActiveFetch]);

	useEffect(() => {
		if (!hasMore || error) return;
		const node = sentinelRef.current;
		if (!node) return;
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

	const reloadList = useCallback(() => {
		abortActiveFetch();
		seenKeysRef.current = new Set();
		setNewObjects([]);
		setCountAll(null);
		setHasMore(true);
		setError(null);
		setLastLoadedPage(initialPage - 1);
		fetchPage(initialPage);
	}, [abortActiveFetch, fetchPage, initialPage]);

	const insertItem = useCallback(
		(file) => {
			const key = buildKey(file, "upload");
			if (seenKeysRef.current.has(key)) return;
			seenKeysRef.current.add(key);
			const entry = { ...file, __key: key };
			setNewObjects((prev) =>
				prependNew ? [entry, ...prev] : [...prev, entry],
			);
			setCountAll((prev) => (typeof prev === "number" ? prev + 1 : prev));
		},
		[prependNew],
	);

	const removeItem = useCallback((key) => {
		if (!seenKeysRef.current.delete(key)) return;
		setNewObjects((prev) => prev.filter((f) => f.__key !== key));
		setCountAll((prev) =>
			typeof prev === "number" ? Math.max(0, prev - 1) : prev,
		);
	}, []);

	const clearList = useCallback(() => {
		abortActiveFetch();
		seenKeysRef.current.clear();
		setNewObjects([]);
		setCountAll(0);
		setHasMore(false);
	}, [abortActiveFetch]);

	return {
		initialPage,
		limit,
		sort,
		hasSsrPayload,
		seenKeysRef,
		sentinelRef,
		newobjects,
		setNewObjects,
		countAll,
		setCountAll,
		hasMore,
		loading,
		error,
		handleRetry,
		reloadList,
		insertItem,
		removeItem,
		clearList,
	};
}

export function useObjectUrls() {
	const objectUrlsRef = useRef(new Set());
	const keptUrlsRef = useRef(new Set());

	useEffect(() => {
		const objectUrls = objectUrlsRef.current;
		const keptUrls = keptUrlsRef.current;
		return () => {
			objectUrls.forEach((url) => URL.revokeObjectURL(url));
			objectUrls.clear();
			keptUrls.clear();
		};
	}, []);

	const createObjectUrl = useCallback((blob) => {
		const url = URL.createObjectURL(blob);
		objectUrlsRef.current.add(url);
		return url;
	}, []);

	const revokeObjectUrl = useCallback((url) => {
		if (!url || keptUrlsRef.current.has(url)) return;
		URL.revokeObjectURL(url);
		objectUrlsRef.current.delete(url);
	}, []);

	const keepObjectUrl = useCallback((url) => {
		if (url) keptUrlsRef.current.add(url);
	}, []);

	return { createObjectUrl, revokeObjectUrl, keepObjectUrl };
}

const STATUS_ACTIONS = {
	draft: { path: "draftit", status: "draft", verb: "draft", done: "drafted" },
	publish: {
		path: "publishit",
		status: "published",
		verb: "publish",
		done: "published",
	},
	trash: { path: "trashit", status: "trash", verb: "trash", done: "trashed" },
	schedule: {
		path: "scheduleit",
		status: "scheduled",
		verb: "schedule",
		done: "scheduled",
	},
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function useListActions({
	list,
	endpoint,
	noun,
	nounPlural = noun + "s",
	bulkBody = {},
	onAllDeleted,
}) {
	const isMountedRef = useIsMounted();
	const { setNewObjects, clearList } = list;
	const busyRef = useRef(new Map());
	const [busy, setBusy] = useState({});
	const bulkBusyRef = useRef(false);
	const [trashingAll, setTrashingAll] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);

	const setRowBusy = (key, action) => {
		if (action) busyRef.current.set(key, action);
		else busyRef.current.delete(key);
		setBusy(Object.fromEntries(busyRef.current));
	};

	const isBusy = (key, action) => busy[key] === action;

	const runRowAction = async (item, action, request) => {
		if (!item?._id)
			return { status: "error", message: `This ${noun} has no id` };

		if (busyRef.current.has(item.__key)) {
			return {
				status: "error",
				message: `This ${noun} is still being updated`,
			};
		}
		setRowBusy(item.__key, action);
		const res = await safeFetch(...request);
		if (isMountedRef.current) setRowBusy(item.__key, null);
		return res;
	};

	const changeStatus = (action) => async (item) => {
		const { path, status, verb, done } = STATUS_ACTIONS[action];
		const res = await runRowAction(item, action, [
			`${endpoint}/${item?._id}/${path}`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		]);
		if (!isMountedRef.current) return res;
		if (isFailure(res)) {
			toast.error(res?.message || `Could not ${verb} the ${noun}`);
			return res;
		}
		toast.success(`${capitalize(noun)} ${done}`);
		setNewObjects((prev) =>
			prev.map((f) => (f.__key === item.__key ? { ...f, status } : f)),
		);
		return res;
	};

	const handleDraftIt = changeStatus("draft");
	const handlePublishIt = changeStatus("publish");
	const handleTrashIt = changeStatus("trash");
	const handleScheduleIt = changeStatus("schedule");

	const handleDeleteIt = async (item) => {
		const res = await runRowAction(item, "delete", [
			`${endpoint}/${item?._id}/permanently`,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		]);
		if (isMountedRef.current && !isFailure(res)) {
			toast.success(`${capitalize(noun)} deleted`);
		}
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
			undefined,
			false,
			false,
		]);
		if (!isMountedRef.current || isFailure(res)) return res;
		setNewObjects((prev) => prev.map((f) => ({ ...f, status: "trash" })));
		toast.success(`All ${nounPlural} trashed`);
		return res;
	};

	const handleDeleteAll = async () => {
		const res = await runBulk(setDeletingAll, [
			`${endpoint}/deleteall/permanently`,
			"DELETE",
			"no-cache",
			bulkBody,
			undefined,
			false,
			false,
		]);
		if (!isMountedRef.current || isFailure(res)) return res;
		clearList();
		onAllDeleted?.();
		toast.success(`All ${nounPlural} deleted`);
		return res;
	};

	return {
		isBusy,
		handleDraftIt,
		handlePublishIt,
		handleTrashIt,
		handleScheduleIt,
		handleDeleteIt,
		trashingAll,
		deletingAll,
		handleTrashAll,
		handleDeleteAll,
	};
}

export function useFileActions({ list = {} } = {}) {
	const isMountedRef = useIsMounted();
	const { clearList, reloadList } = list;

	const deletingKeysRef = useRef(new Set());

	const [deletingKeys, setDeletingKeys] = useState(() => new Set());

	const bulkBusyRef = useRef(false);
	const [deletingAll, setDeletingAll] = useState(false);
	const [deletingUnused, setDeletingUnused] = useState(false);

	const setDeleting = (key, isDeleting) => {
		if (isDeleting) deletingKeysRef.current.add(key);
		else deletingKeysRef.current.delete(key);
		setDeletingKeys(new Set(deletingKeysRef.current));
	};

	const isDeleting = (key) => deletingKeys.has(key);

	const handleDeleteIt = async (item) => {
		if (!item?._id) return { status: "error", message: "This file has no id" };
		if (deletingKeysRef.current.has(item.__key)) {
			return { status: "error", message: "This file is still being deleted" };
		}
		setDeleting(item.__key, true);
		const res = await safeFetch(
			`/noadmin/files/${item._id}/permanently`,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		if (!isMountedRef.current) return res;
		setDeleting(item.__key, false);
		if (!isFailure(res)) toast.success("File deleted");
		return res;
	};

	const runBulk = async (setFlag, url) => {
		if (bulkBusyRef.current) {
			return {
				status: "error",
				message: "Another bulk action is still running",
			};
		}
		bulkBusyRef.current = true;
		setFlag(true);
		const res = await safeFetch(
			url,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);
		bulkBusyRef.current = false;
		if (isMountedRef.current) setFlag(false);
		return res;
	};

	const handleDeleteAll = async () => {
		const res = await runBulk(setDeletingAll, "/noadmin/files/deleteall");
		if (!isMountedRef.current || isFailure(res)) return res;

		clearList?.();
		toast.success("All files deleted");
		return res;
	};

	const handleDeleteUnused = async () => {
		const res = await runBulk(
			setDeletingUnused,
			"/noadmin/files/deleteall/unused/permanently",
		);
		if (!isMountedRef.current || isFailure(res)) return res;
		toast.success("Unused files deleted");

		reloadList?.();
		return res;
	};

	return {
		isDeleting,
		handleDeleteIt,
		deletingAll,
		deletingUnused,
		handleDeleteAll,
		handleDeleteUnused,
	};
}

export function useMediaElements() {
	const mediaElementsRef = useRef(new Map());

	useEffect(() => {
		const elements = mediaElementsRef.current;
		return () => elements.clear();
	}, []);

	const pauseAllMedia = useCallback((exceptId) => {
		mediaElementsRef.current.forEach((element, id) => {
			if (id !== exceptId && !element.paused) element.pause();
		});
	}, []);

	const registerMediaElement = useCallback((id, element) => {
		if (element) mediaElementsRef.current.set(id, element);
		else mediaElementsRef.current.delete(id);
	}, []);

	const forgetMediaElement = useCallback((id) => {
		mediaElementsRef.current.delete(id);
	}, []);

	return { pauseAllMedia, registerMediaElement, forgetMediaElement };
}

export function useUploadReorder(setFiles, uploadsRef) {
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);

	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = useCallback((e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex((prev) => (prev === index ? prev : index));
	}, []);

	const handleDragLeave = (e) => {
		if (e.currentTarget.contains(e.relatedTarget)) return;
		setDragOverIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	const handleDrop = (e, dropIndex) => {
		e.preventDefault();
		const from = draggedIndex;
		handleDragEnd();
		if (from === null || from === dropIndex) return;
		if (dropIndex >= uploadsRef.current.length) return;
		setFiles((prev) => {
			if (dropIndex >= prev.length || from >= prev.length) return prev;
			const next = [...prev];
			const [moved] = next.splice(from, 1);
			next.splice(dropIndex, 0, moved);
			return next;
		});
	};

	return {
		draggedIndex,
		dragOverIndex,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleDragEnd,
	};
}

export function useListReorder({ list, saveEndpoint }) {
	const isMountedRef = useIsMounted();
	const { setNewObjects, newobjects, initialPage, limit } = list;
	const [itemDraggedIndex, setItemDraggedIndex] = useState(null);
	const [itemDragOverIndex, setItemDragOverIndex] = useState(null);
	const [isDirty, setIsDirty] = useState(false);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [success, setSuccess] = useState("");

	const savingRef = useRef(false);

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
		if (e.currentTarget.contains(e.relatedTarget)) return;
		setItemDragOverIndex(null);
	};

	const handleItemDragEnd = () => {
		setItemDraggedIndex(null);
		setItemDragOverIndex(null);
	};

	const handleItemDrop = (e, dropIndex) => {
		e.preventDefault();
		const from = itemDraggedIndex;
		handleItemDragEnd();
		if (from === null || from === dropIndex) return;
		setNewObjects((prev) => {
			if (dropIndex >= prev.length || from >= prev.length) return prev;
			const next = [...prev];
			const [moved] = next.splice(from, 1);
			next.splice(dropIndex, 0, moved);
			return next;
		});
		setIsDirty(true);
		setSuccess("");
		setSaveError("");
	};

	const handleSave = async () => {
		if (savingRef.current) return;
		savingRef.current = true;
		setSaving(true);
		setSaveError("");
		setSuccess("");

		const offset = (initialPage - 1) * limit;
		const order = newobjects
			.filter((it) => it?._id)
			.map((it, idx) => ({ _id: it._id, orderingNumber: offset + idx + 1 }));
		const res = await safeFetch(
			saveEndpoint,
			"PUT",
			"no-cache",
			{ order },
			undefined,
			false,
			false,
		);
		savingRef.current = false;
		if (!isMountedRef.current) return;
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

	return {
		itemDraggedIndex,
		itemDragOverIndex,
		isDirty,
		setIsDirty,
		saving,
		saveError,
		setSaveError,
		success,
		setSuccess,
		handleItemDragStart,
		handleItemDragOver,
		handleItemDragLeave,
		handleItemDrop,
		handleItemDragEnd,
		handleSave,
	};
}

const titleOf = (item) => item?.raw?.title || "";

export function useListSearch(items, getText = titleOf) {
	const [keyword, setKeyword] = useState("");
	const [debouncedKeyword, setDebouncedKeyword] = useState("");
	const getTextRef = useRef(getText);
	getTextRef.current = getText;

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), 400);
		return () => clearTimeout(timer);
	}, [keyword]);

	const searchData = (e) => {
		e.preventDefault();
		setDebouncedKeyword(keyword.trim());
	};

	const clearSearch = () => {
		setKeyword("");
		setDebouncedKeyword("");
	};

	const displayedItems = useMemo(() => {
		if (!debouncedKeyword) return items;
		const needle = debouncedKeyword.toLowerCase();
		return items.filter((item) =>
			(getTextRef.current(item) || "").toLowerCase().includes(needle),
		);
	}, [items, debouncedKeyword]);

	return {
		keyword,
		setKeyword,
		debouncedKeyword,
		setDebouncedKeyword,
		searchData,
		clearSearch,
		displayedItems,
	};
}
