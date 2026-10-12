"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const guessKind = (url, mime) => {
	const u = (url || "").toLowerCase();
	if (mime) {
		if (mime.indexOf("image") === 0) return "image";
		if (mime.indexOf("video") === 0) return "video";
		if (mime.indexOf("audio") === 0) return "audio";
	}
	if (/\.(png|jpe?g|jfif|gif|webp|avif|svg|bmp)(\?|$)/.test(u)) return "image";
	if (/\.(mp4|m4v|webm|mov|ogv)(\?|$)/.test(u)) return "video";
	if (/\.(mp3|wav|m4a|aac|flac|oga|opus)(\?|$)/.test(u)) return "audio";
	// .ogg can hold either; treat it as both so neither picker hides it.
	if (/\.ogg(\?|$)/.test(u)) return "ogg";
	return "file";
};

// The API's `format_type` ("image" | "video" | "audio" | "application") is the
// source of truth; the extension guess only covers records without one.
const kindOf = (item) => {
	const type = item && item.format_type;
	if (type === "image" || type === "video" || type === "audio") return type;
	return guessKind(fileUrlOf(item), item && item.mimetype);
};

const FILES_PER_PAGE = 28;
const SEARCH_DELAY_MS = 300;

// The files API answers both "nothing matched" and "page past the end" with
// this fail response instead of an empty `data` array.
const isEmptyPageResponse = (json) =>
	!!json &&
	json.status === "fail" &&
	/page does not exist/i.test(json.message || "");

const fileUrlOf = (item) => {
	const loc = (item && item.location) || {};
	return loc.secure_location || loc.insecure_location || loc.aws_location || "";
};

// `title` is the name the file was uploaded under; `location.filename` is the
// storage name with the owner id and email baked in, so it is only a fallback.
const fileNameOf = (item) => {
	if (!item) return "file";
	const loc = item.location || {};
	return (
		item.title ||
		(item.resourceId && item.resourceId.title) ||
		loc.filename ||
		(item._id ? `File ${item._id}` : "file")
	);
};

// Accepts a populated document or a bare id string.
const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "object") {
		const id = value._id || value.id || "";
		return id ? String(id) : "";
	}
	return String(value);
};

// A record may hold the populated file or just its id; either way keep an object.
const toFileObject = (value) => {
	if (!value) return null;
	if (typeof value === "object") return idOf(value) ? value : null;
	return { _id: String(value) };
};

const KIND_LABELS = {
	video: { noun: "video", icon: "fa-film" },
	audio: { noun: "audio", icon: "fa-music" },
};

function MediaFilePicker({
	name,
	kind,
	label,
	initialFile = null,
	allowClear = true,
}) {
	const fieldId = useId();
	const wrapperRef = useRef(null);
	const { noun, icon } = KIND_LABELS[kind] || KIND_LABELS.video;

	const seed = toFileObject(initialFile);
	const seedId = idOf(seed);
	const seedRef = useRef(seed);
	seedRef.current = seed;
	// Whether the user has picked or cleared a file since the last seed.
	const touchedRef = useRef(false);

	const [chosenFile, setChosenFile] = useState(seed);
	const [showFiles, setShowFiles] = useState(false);
	const [fileSelection, setFileSelection] = useState(null);
	const [fileSearch, setFileSearch] = useState("");
	const [fileState, setFileState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
		keyword: "",
		loading: false,
		error: "",
	});

	const isMountedRef = useRef(true);
	// Only the newest page request may write state, so a slow earlier response
	// can't overwrite the page the user is on.
	const requestIdRef = useRef(0);
	// The keyword of the latest request, read by paging and the search debounce.
	const keywordRef = useRef("");
	const searchTimerRef = useRef(0);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			requestIdRef.current++;
			clearTimeout(searchTimerRef.current);
		};
	}, []);

	// On an edit page the record can arrive a render late; adopt it unless the
	// user has already made a choice of their own.
	useEffect(() => {
		if (touchedRef.current) return;
		setChosenFile(seedRef.current);
	}, [seedId]);

	// The hidden input is controlled, so a native form reset would not touch our state.
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

	// `format_type` makes the API return only this picker's kind, so counts and
	// page totals are accurate; `keyword` searches every page, not just this one.
	const loadFiles = async (page, keyword = keywordRef.current) => {
		const requestId = ++requestIdRef.current;
		keywordRef.current = keyword;
		setFileState((s) => ({ ...s, page, keyword, loading: true, error: "" }));
		const query =
			`page=${page}&limit=${FILES_PER_PAGE}&format_type=${encodeURIComponent(kind)}` +
			(keyword ? `&keyword=${encodeURIComponent(keyword)}` : "");
		try {
			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const json = await fetchurl(
				`/global/files?${query}`,
				"GET",
				"no-cache",
				{},
				null,
				false,
				false,
			);
			if (!isMountedRef.current || requestId !== requestIdRef.current) return;
			if (!json || !Array.isArray(json.data)) {
				if (isEmptyPageResponse(json)) {
					// A remembered page can fall off the end once files are deleted, so
					// step back to page 1 before calling the list empty.
					if (page > 1) {
						loadFiles(1, keyword);
						return;
					}
					setFileState({
						items: [],
						page: 1,
						totalPages: 1,
						keyword,
						loading: false,
						error: "",
					});
					return;
				}
				throw new Error((json && json.message) || "Failed to load files");
			}
			setFileState({
				items: json.data,
				page: (json.pagination && json.pagination.current) || page,
				totalPages: (json.pagination && json.pagination.totalpages) || 1,
				keyword,
				loading: false,
				error: "",
			});
		} catch (err) {
			if (!isMountedRef.current || requestId !== requestIdRef.current) return;
			setFileState((s) => ({
				...s,
				loading: false,
				error: (err && err.message) || "Failed to load files",
			}));
		}
	};

	const goToPage = (page) => {
		if (page === fileState.page && !fileState.error) return;
		setFileSelection(null);
		loadFiles(page);
	};

	// Refetch on every open so files uploaded since the last open show up.
	const openFileManager = () => {
		clearTimeout(searchTimerRef.current);
		setFileSelection(null);
		setFileSearch("");
		setShowFiles(true);
		loadFiles(fileState.page, "");
	};

	const closeFileManager = useCallback(() => {
		// Drop any in-flight response and pending search; the next open fetches fresh anyway.
		clearTimeout(searchTimerRef.current);
		requestIdRef.current++;
		setFileState((s) => (s.loading ? { ...s, loading: false } : s));
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

	// Enter searches right away instead of waiting out the debounce.
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

	// Takes the item directly so double-click doesn't read a stale selection.
	const applyFile = (item) => {
		if (!item) return;
		touchedRef.current = true;
		setChosenFile(item);
		closeFileManager();
		setFileSelection(null);
	};

	const clearFile = () => {
		touchedRef.current = true;
		setChosenFile(null);
	};

	const visibleFiles = fileState.items.filter((item) => fileUrlOf(item));

	const chosenId = idOf(chosenFile);
	const chosenUrl = fileUrlOf(chosenFile);
	const selectedId = idOf(fileSelection);

	return (
		<div ref={wrapperRef}>
			<label htmlFor={fieldId} className="form-label">
				{label}
			</label>

			{/* Keyed so the player drops the old file's buffer instead of reusing it. */}
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
					onClick={openFileManager}
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

			{/* Portaled out of the parent <form> so Enter in the filter box can't submit it. */}
			{showFiles &&
				createPortal(
					<BootstrapModal
						title={`File Manager — ${label}`}
						icon="folder-open"
						size="modal-xl"
						onClose={closeFileManager}
					>
						<div className="modal-body">
							<div className="d-flex flex-wrap align-items-center gap-3 mb-3">
								<div
									className="input-group input-group-sm flex-grow-1"
									style={{ minWidth: 220 }}
								>
									<span className="input-group-text">
										<i
											className="fa-solid fa-magnifying-glass"
											aria-hidden="true"
										/>
									</span>
									<input
										type="search"
										className="form-control"
										placeholder={`Search ${noun} files by name...`}
										aria-label={`Search ${noun} files by name`}
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
												? `No ${noun} files match \u201C${fileState.keyword}\u201D.`
												: `You don't have any ${noun} files yet.`}
										</div>
									)}
									{visibleFiles.map((item, i) => {
										const url = fileUrlOf(item);
										const itemName = fileNameOf(item);
										const itemKind = kindOf(item);
										const itemId = idOf(item);
										const isSelected = !!selectedId && selectedId === itemId;
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
													onDoubleClick={() => applyFile(item)}
												>
													{isSelected && (
														<span className="badge text-bg-primary position-absolute top-0 end-0 m-2 z-1">
															<i
																className="fa-solid fa-check"
																aria-hidden="true"
															/>
														</span>
													)}
													{itemKind === "image" ? (
														<img
															src={url}
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
																	(itemKind === "video"
																		? "fa-film"
																		: itemKind === "audio" || itemKind === "ogg"
																			? "fa-music"
																			: "fa-file")
																}
															/>
														</div>
													)}
													<div className="card-body p-2">
														<p
															className="small text-truncate mb-0"
															title={itemName}
														>
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
										<i className={"fa-solid me-1 " + icon} aria-hidden="true" />
										{fileNameOf(fileSelection)}
									</small>
								)}
								<button
									type="button"
									className="btn btn-primary btn-sm"
									disabled={!fileSelection}
									onClick={() => applyFile(fileSelection)}
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
				)}
		</div>
	);
}

function BootstrapModal({ title, icon, size = "", onClose, children }) {
	// Read through a ref so a new onClose identity never tears down the listener
	// or flickers `modal-open` off and on.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onCloseRef.current();
		}
		document.addEventListener("keydown", onKey);
		document.body.classList.add("modal-open");
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.classList.remove("modal-open");
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

function ModalSpinner({ label }) {
	return (
		<div className="text-center py-5 text-body-secondary">
			<div className="spinner-border" role="status">
				<span className="visually-hidden">{label}</span>
			</div>
			<p className="mt-2 mb-0">{label}</p>
		</div>
	);
}

// Only a window around the current page is drawn, with the first and last
// always reachable and an ellipsis standing in for the gap, so a large library
// can't overflow the modal footer.
function Pagination({ page, totalPages, onPage, label, disabled = false }) {
	const total = Math.max(1, Number(totalPages) || 1);
	const current = Math.min(Math.max(1, Number(page) || 1), total);
	// The footer is `justify-content-between`: without a first child the action
	// buttons would slide to the left.
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

const toId = (value) => {
	if (!value) {
		return "";
	}
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	return String(value._id || value.id || "");
};

const toMention = (value) =>
	typeof value === "string" || typeof value === "number"
		? { id: String(value), username: "" }
		: { id: toId(value), username: value?.username || "" };

const UpdateChapterForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();
	const submittingRef = useRef(false);

	const [btnText, setBtnText] = useState(`Submit`);

	const savedFiles = Array.isArray(object?.data?.files?.extras)
		? object?.data?.files.extras
		: [];

	const upgradeChapter = async (e) => {
		e.preventDefault();
		if (submittingRef.current) return;
		submittingRef.current = true;
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");
		const extras = JSON.parse(formData.get("text_files") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			status: formData.get("status"),
			language: formData.get("language"),
			captionCert: formData.get("captionCert"),
			recordingDate: formData.get("recordingDate"),
			address: formData.get("address"),
			license: formData.get("license"),
			free_preview: formData.get("free_preview"),
			duration: formData.get("duration"),
			averageRating: formData.get("averageRating"),
			orderingNumber: formData.get("orderingNumber"),
			players: {
				mega: formData.get("mega"),
				streamwish: formData.get("streamwish"),
				yourupload: formData.get("yourupload"),
				okru: formData.get("okru"),
				maru: formData.get("maru"),
				netu: formData.get("netu"),
				stape: formData.get("stape"),
				cloudinary: formData.get("cloudinary"),
			},
			downloads: {
				mega: formData.get("mega_download"),
				onefichier: formData.get("onefichier"),
				stape: formData.get("stape_download"),
			},
			files: {
				avatar: formData.get("file") || undefined,
				video_url: formData.get("video_url") || undefined,
				extras:
					bodyUnchanged && !extras.length
						? savedFiles.map(toId).filter(Boolean)
						: extras,
			},
		};

		const res = await fetchurl(
			`/noadmin/videos/${object?.data._id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		).catch((err) => ({
			status: "error",
			message: err && err.message,
		}));

		if (!res || res.status === "error" || res.status === "fail") {
			toast.error((res && res.message) || "Something went wrong");
			setBtnText(btnText);
			submittingRef.current = false;
			return;
		}
		toast.success(`Anime chapter updated`);
		router.push(`/noadmin/animes/read/${object?.data?.resourceId?._id}`);
	};

	return (
		<form key={object?.data?._id} className="row" onSubmit={upgradeChapter}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					defaultFiles={savedFiles}
					onModel="Video"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue={object?.data?.address}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="language" className="form-label">
							Language
						</label>
						<select
							id="language"
							name="language"
							defaultValue={object?.data?.language}
							className="form-select mb-3"
						>
							<option value="english">English</option>
							<option value="mandarin">Mandarin</option>
							<option value="hindi">Hindi</option>
							<option value="spanish">Spanish</option>
							<option value="french">French</option>
							<option value="arabic">Arabic</option>
							<option value="bengali">Bengali</option>
							<option value="russian">Russian</option>
							<option value="portuguese">Portuguese</option>
							<option value="indonesian">Indonesian</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="captionCert" className="form-label">
							Caption Certificate
						</label>
						<select
							id="captionCert"
							name="captionCert"
							defaultValue={object?.data?.captionCert}
							className="form-select mb-3"
						>
							<option value="0">None</option>
							<option value="1">
								This content has never aired on television in the U.S.
							</option>
							<option value="2">
								This content has only aired on television in the U.S. without
								captions
							</option>
							<option value="3">
								This content has not aired on U.S. television with captions
								since September 30, 2012.
							</option>
							<option value="4">
								This content does not consist of full-length video programming.
							</option>
							<option value="5">
								This content does not fall within a category of online
								programming that requires captions under FCC regulations (47
								C.F.R. § 79).
							</option>
							<option value="6">
								The FCC and/or U.S. Congress has granted an exemption from
								captioning requirements for this content.
							</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="recordingDate" className="form-label">
							Recording Date
						</label>
						<input
							id="recordingDate"
							name="recordingDate"
							defaultValue={object?.data?.recordingDate}
							type="text"
							className="form-control mb-3"
							placeholder="01/30/2020"
						/>
					</div>
					<div className="col">
						<label htmlFor="license" className="form-label">
							License
						</label>
						<select
							id="license"
							name="license"
							defaultValue={object?.data?.license}
							className="form-select"
						>
							<option value="0">Standard beFree license</option>
							<option value="1">Creative Commons - Attribution</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="free_preview" className="form-label">
							Free Preview
						</label>
						<select
							id="free_preview"
							name="free_preview"
							defaultValue={String(object?.data?.free_preview ?? true)}
							className="form-select"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="duration" className="form-label">
							Duration
						</label>
						<input
							id="duration"
							name="duration"
							defaultValue={object?.data?.duration}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="averageRating" className="form-label">
							Average Rating
						</label>
						<select
							id="averageRating"
							name="averageRating"
							defaultValue={object?.data?.averageRating}
							className="form-select"
						>
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={8}>8</option>
							<option value={9}>9</option>
							<option value={10}>10</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Order
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={object?.data?.orderingNumber}
							type="number"
							className="form-control mb-3"
							placeholder="Here goes the #number of object within list"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<h4>Players</h4>
						<MediaFilePicker
							name="video_url"
							kind="video"
							label="Video"
							initialFile={object?.data?.files?.video_url}
						/>
						<label htmlFor="mega" className="form-label">
							Mega
						</label>
						<input
							id="mega"
							name="mega"
							defaultValue={object?.data?.players?.mega}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="streamwish" className="form-label">
							Streamwish
						</label>
						<input
							id="streamwish"
							name="streamwish"
							defaultValue={object?.data?.players?.streamwish}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="yourupload" className="form-label">
							Your Upload
						</label>
						<input
							id="yourupload"
							name="yourupload"
							defaultValue={object?.data?.players?.yourupload}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="okru" className="form-label">
							Okru
						</label>
						<input
							id="okru"
							name="okru"
							defaultValue={object?.data?.players?.okru}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="maru" className="form-label">
							Maru
						</label>
						<input
							id="maru"
							name="maru"
							defaultValue={object?.data?.players?.maru}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="netu" className="form-label">
							Netu
						</label>
						<input
							id="netu"
							name="netu"
							defaultValue={object?.data?.players?.netu}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="stape" className="form-label">
							Stape
						</label>
						<input
							id="stape"
							name="stape"
							defaultValue={object?.data?.players?.stape}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="cloudinary" className="form-label">
							Cloudinary
						</label>
						<input
							id="cloudinary"
							name="cloudinary"
							defaultValue={object?.data?.players?.cloudinary}
							type="text"
							className="form-control"
							placeholder=""
						/>
					</div>
					<div className="col">
						<h4>Downloads</h4>
						<label htmlFor="mega_download" className="form-label">
							Mega
						</label>
						<input
							id="mega_download"
							name="mega_download"
							defaultValue={object?.data?.downloads?.mega}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="onefichier" className="form-label">
							One Fichier
						</label>
						<input
							id="onefichier"
							name="onefichier"
							defaultValue={object?.data?.downloads?.onefichier}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="stape_download" className="form-label">
							Stape
						</label>
						<input
							id="stape_download"
							name="stape_download"
							defaultValue={object?.data?.downloads?.stape}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={object?.data?.files}
					avatarFormat={object?.data?.files?.avatar?.format_type}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={String(object?.data?.commented ?? true)}
					embedding={String(object?.data?.embedding ?? true)}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateChapterForm;
