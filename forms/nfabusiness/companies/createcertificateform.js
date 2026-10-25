"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
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
	if (/\.pdf(\?|$)/.test(u)) return "pdf";
	return "file";
};

// The API's `format_type` ("image" | "video" | "audio" | "application") is the
// source of truth; the extension guess only covers records without one.
const kindOf = (item) => {
	const type = item && item.format_type;
	if (type === "image" || type === "video" || type === "audio") return type;
	if (item && String(item.format || "").toLowerCase() === "pdf") return "pdf";
	return guessKind(fileUrlOf(item), item && item.mimetype);
};

// A malformed hidden field must not throw mid-submit and strand the button on
// "Processing...".
const parseJsonArray = (raw) => {
	try {
		const value = JSON.parse(raw || "[]");
		return Array.isArray(value) ? value : [];
	} catch {
		return [];
	}
};

// The files API has no OR filter (`format_type=image,application` fails), so
// each kind gets its own exact query and the modal switches between them.
const FILE_KINDS = {
	image: { label: "Images", noun: "image", query: "format_type=image" },
	pdf: { label: "PDFs", noun: "PDF", query: "format=pdf" },
};

// Storage URLs don't always end in ".pdf", so the kind recorded when the file
// was picked wins over guessing from the URL.
const displayKindOf = (value) => value.kind || guessKind(value.url);
const pickerKindOf = (value) =>
	displayKindOf(value) === "pdf" ? "pdf" : "image";

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

const FIELD_LABELS = {
	credentialURL: "Credential Copy",
};

const FIELDS = ["credentialURL"];

const EMPTY_FIELD = { url: "", id: "", name: "", kind: "" };

const CreateCertificateForm = ({ token = {}, auth = {}, params = {} }) => {
	const router = useRouter();
	const submittingRef = useRef(false);

	const [btnText, setBtnText] = useState("Submit");

	const [files, setFiles] = useState({
		credentialURL: EMPTY_FIELD,
	});

	const [showFiles, setShowFiles] = useState(false);
	const [fileTarget, setFileTarget] = useState("");
	const [fileSelection, setFileSelection] = useState(null);
	const [fileSearch, setFileSearch] = useState("");
	const [fileKind, setFileKind] = useState("image");

	const [fileState, setFileState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
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
	// The kind of the latest request, read the same way as `keywordRef`.
	const kindRef = useRef("image");

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			requestIdRef.current++;
			clearTimeout(searchTimerRef.current);
		};
	}, []);

	// Filtering server-side per kind keeps counts and page totals accurate;
	// `keyword` searches every page, not just this one.
	const loadFiles = async (page, keyword = keywordRef.current) => {
		const requestId = ++requestIdRef.current;
		keywordRef.current = keyword;
		setFileState((s) => ({ ...s, page, keyword, loading: true, error: "" }));
		const query =
			`page=${page}&limit=${FILES_PER_PAGE}&${FILE_KINDS[kindRef.current].query}` +
			(keyword ? `&keyword=${encodeURIComponent(keyword)}` : "");
		try {
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
	// Opens on the current file's kind so a saved PDF is visible as "Current".
	const openFileManager = (target) => {
		clearTimeout(searchTimerRef.current);
		const kind = files[target].url
			? pickerKindOf(files[target])
			: kindRef.current;
		const sameKind = kind === kindRef.current;
		kindRef.current = kind;
		setFileKind(kind);
		setFileTarget(target);
		setFileSelection(null);
		setFileSearch("");
		setShowFiles(true);
		loadFiles(sameKind ? fileState.page : 1, "");
	};

	// Keeps the search term so switching kinds narrows the same way.
	const switchFileKind = (kind) => {
		if (kind === kindRef.current) return;
		clearTimeout(searchTimerRef.current);
		kindRef.current = kind;
		setFileKind(kind);
		setFileSelection(null);
		loadFiles(1, fileSearch.trim());
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
		if (!item || !fileTarget) return;
		setFiles((prev) => ({
			...prev,
			[fileTarget]: {
				url: fileUrlOf(item),
				id: idOf(item),
				name: fileNameOf(item),
				kind: kindOf(item),
			},
		}));
		closeFileManager();
		setFileSelection(null);
		setFileTarget("");
	};

	const setFieldUrl = (field, url) => {
		setFiles((prev) => ({ ...prev, [field]: { ...EMPTY_FIELD, url } }));
	};

	const clearField = (field) => {
		setFiles((prev) => ({ ...prev, [field]: EMPTY_FIELD }));
	};

	const addCertificate = async (e) => {
		e.preventDefault();

		const typedOnly = FIELDS.filter((f) => files[f].url && !files[f].id);
		if (typedOnly.length) {
			toast.error(
				`Pick ${typedOnly
					.map((f) => FIELD_LABELS[f])
					.join(", ")} from Files — a typed location has no file id to save`,
			);
			return;
		}

		if (submittingRef.current) return;
		submittingRef.current = true;
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			name: formData.get("name"),
			organization: formData.get("organization"),
			from: formData.get("from"),
			to: formData.get("to"),
			current: formData.get("current"),
			credentialId: formData.get("credentialId"),
			credentialURL: formData.get("credentialURLId"),
			text: formData.get("text"),
			mentions: parseJsonArray(formData.get("text_users")),
			tags: parseJsonArray(formData.get("text_hashtags")),
		};

		const res = await fetchurl(
			`/noadmin/companies/${params.id}/certificates`,
			"POST",
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
			submittingRef.current = false;
			if (isMountedRef.current) setBtnText("Submit");
			return;
		}

		toast.success(`Certificate created`);
		router.push(`/nfabusiness/companies/read/${params.id}`);
	};

	const fileField = (field) => {
		const value = files[field];
		const kind = displayKindOf(value);
		return (
			<>
				<label htmlFor={field} className="form-label">
					{FIELD_LABELS[field]}
				</label>
				<div className="input-group mb-1">
					<input
						id={field}
						name={field}
						value={value.url}
						onChange={(e) => setFieldUrl(field, e.target.value)}
						type="text"
						className="form-control"
						placeholder="Pick a file or paste a location"
					/>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => openFileManager(field)}
						title={"Pick " + FIELD_LABELS[field] + " from files"}
					>
						<i className="fa-solid fa-folder-open me-1" />
						Files
					</button>
					{(value.url || value.id) && (
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => clearField(field)}
						>
							<i className="fa-solid fa-xmark align-middle" />
							<span className="visually-hidden">
								{"Clear " + FIELD_LABELS[field]}
							</span>
						</button>
					)}
				</div>
				<input type="hidden" name={field + "Id"} value={value.id} readOnly />
				{value.url ? (
					<div className="d-flex align-items-center gap-2 mb-3 small text-body-secondary">
						{kind === "image" ? (
							<img
								src={value.url || "/placeholder.svg"}
								alt=""
								width={32}
								height={32}
								className="rounded border"
								style={{ objectFit: "cover" }}
							/>
						) : (
							<i
								className={
									"fa-solid " + (kind === "pdf" ? "fa-file-pdf" : "fa-file")
								}
								aria-hidden="true"
							/>
						)}
						{/* <span className="text-truncate">
							{value.name || value.url}
							{value.id ? " · " + value.id : " · manual location"}
						</span> */}
					</div>
				) : (
					<div className="mb-3" />
				)}
			</>
		);
	};

	const visibleFiles = fileState.items.filter((item) => fileUrlOf(item));

	return (
		<>
			<form onSubmit={addCertificate}>
				<div className="row">
					<div className="col">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							defaultValue="Unnamed"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="organization" className="form-label">
							Organization
						</label>
						<input
							id="organization"
							name="organization"
							defaultValue="No organization"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="from" className="form-label">
							From
						</label>
						<input
							id="from"
							name="from"
							defaultValue="2025-10-09"
							type="date"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="to" className="form-label">
							To
						</label>
						<input
							id="to"
							name="to"
							defaultValue="2025-10-10"
							type="date"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col-lg-12">
						<label htmlFor="current" className="form-label">
							Is it current?
						</label>
						<select
							id="current"
							name="current"
							defaultValue={false}
							className="form-select mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="credentialId" className="form-label">
							Credential ID
						</label>
						<input
							id="credentialId"
							name="credentialId"
							defaultValue="No credentialId"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">{fileField("credentialURL")}</div>
					<div className="col-lg-12">
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
							auth={auth}
							token={token}
							id="text"
							name="text"
							defaultValue="No description..."
							onModel="Job"
							advancedTextEditor={false}
							customPlaceholder="No description"
							charactersLimit={99999}
							isRequired={false}
						/>
					</div>
				</div>
				<FormButtons />
			</form>
			{showFiles && (
				<BootstrapModal
					title={
						"File Manager" +
						(fileTarget ? " — " + FIELD_LABELS[fileTarget] : "")
					}
					icon="folder-open"
					size="modal-xl"
					onClose={closeFileManager}
				>
					<div className="modal-body">
						<div className="d-flex flex-wrap gap-2 mb-3">
							<div
								className="btn-group btn-group-sm"
								role="group"
								aria-label="File type"
							>
								{Object.keys(FILE_KINDS).map((kind) => (
									<button
										key={kind}
										type="button"
										className={
											"btn " +
											(fileKind === kind
												? "btn-primary"
												: "btn-outline-primary")
										}
										aria-pressed={fileKind === kind}
										onClick={() => switchFileKind(kind)}
									>
										<i
											className={
												"fa-solid me-1 " +
												(kind === "pdf" ? "fa-file-pdf" : "fa-image")
											}
											aria-hidden="true"
										/>
										{FILE_KINDS[kind].label}
									</button>
								))}
							</div>
							<div className="input-group input-group-sm flex-grow-1 w-auto">
								<span className="input-group-text">
									<i
										className="fa-solid fa-magnifying-glass"
										aria-hidden="true"
									/>
								</span>
								<input
									type="search"
									className="form-control"
									placeholder={`Search ${FILE_KINDS[fileKind].noun} files by name...`}
									aria-label={`Search ${FILE_KINDS[fileKind].noun} files by name`}
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
											? `No ${FILE_KINDS[fileKind].noun} files match \u201C${fileState.keyword}\u201D.`
											: `You don't have any ${FILE_KINDS[fileKind].noun} files yet.`}
									</div>
								)}
								{visibleFiles.map((item, i) => {
									const url = fileUrlOf(item);
									const name = fileNameOf(item);
									const kind = kindOf(item);
									const itemId = idOf(item);
									const isSelected =
										!!fileSelection && idOf(fileSelection) === itemId;
									const isCurrent =
										!!fileTarget && !!itemId && files[fileTarget].id === itemId;
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
												aria-label={"Select " + name}
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
												{!isSelected && isCurrent && (
													<span className="badge text-bg-secondary position-absolute top-0 end-0 m-2 z-1">
														Current
													</span>
												)}
												{kind === "image" ? (
													<img
														src={url}
														alt={name}
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
																(kind === "pdf" ? "fa-file-pdf" : "fa-file")
															}
														/>
													</div>
												)}
												<div className="card-body p-2">
													<p className="small text-truncate mb-0" title={name}>
														{name}
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
				</BootstrapModal>
			)}
		</>
	);
};

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

export default CreateCertificateForm;
