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

const FIELD_LABELS = {
	showcase_image: "Showcase Image",
	favicon: "Favicon",
	logo: "Logo",
};

const FIELDS = ["showcase_image", "favicon", "logo"];

const EMPTY_FIELD = { url: "", id: "", name: "" };

const normalizeFileValue = (raw) => {
	if (!raw || typeof raw !== "object") return EMPTY_FIELD;
	return {
		url: fileUrlOf(raw),
		id: raw._id ? String(raw._id) : "",
		name: fileNameOf(raw),
	};
};

const hydrateFields = (data) => ({
	showcase_image: normalizeFileValue(data && data.showcase_image),
	favicon: normalizeFileValue(data && data.favicon),
	logo: normalizeFileValue(data && data.logo),
});

const UpdateSettingForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();
	const submittingRef = useRef(false);

	const [btnText, setBtnText] = useState(`Submit`);

	const settingsId = object?.data?._id;

	// Prefilled synchronously so populated refs never flash an empty input
	const [files, setFiles] = useState(() => hydrateFields(object?.data));

	const [showFiles, setShowFiles] = useState(false);
	const [fileTarget, setFileTarget] = useState("");
	const [fileSelection, setFileSelection] = useState(null);
	const [fileSearch, setFileSearch] = useState("");
	const [fileState, setFileState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
		loading: false,
		error: "",
	});

	/* ---- Prefill from the DB record ---------------------------------------- */

	// Re-seed the controlled inputs if the record arrives (or changes) after mount
	useEffect(() => {
		if (!object?.data) return;
		setFiles(hydrateFields(object.data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settingsId]);

	/* ---- File manager ------------------------------------------------------ */

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

	// Every field on this form is an image, so `format_type=image` keeps counts
	// and page totals accurate; `keyword` searches every page, not just this one.
	const loadFiles = async (page, keyword = keywordRef.current) => {
		const requestId = ++requestIdRef.current;
		keywordRef.current = keyword;
		setFileState((s) => ({ ...s, page, keyword, loading: true, error: "" }));
		const query =
			`page=${page}&limit=${FILES_PER_PAGE}&format_type=image` +
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
	const openFileManager = (target) => {
		clearTimeout(searchTimerRef.current);
		setFileTarget(target);
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
		if (!item || !fileTarget) return;
		setFiles((prev) => ({
			...prev,
			[fileTarget]: {
				url: fileUrlOf(item),
				id: idOf(item),
				name: fileNameOf(item),
			},
		}));
		closeFileManager();
		setFileSelection(null);
		setFileTarget("");
	};

	const setFieldUrl = (field, url) => {
		setFiles((prev) => ({ ...prev, [field]: { url, id: "", name: "" } }));
	};

	const clearField = (field) => {
		setFiles((prev) => ({ ...prev, [field]: EMPTY_FIELD }));
	};

	const resetField = (field) => {
		const original = normalizeFileValue(object?.data?.[field]);
		setFiles((prev) => ({ ...prev, [field]: original }));
	};

	const isDirty = (field) =>
		files[field].id !== normalizeFileValue(object?.data?.[field]).id;

	const upgradeSetting = async (e) => {
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
			author: formData.get("author"),
			author_email: formData.get("author_email"),
			site_url: formData.get("site_url"),
			home_url: formData.get("home_url"),
			favicon: formData.get("faviconId"),
			logo: formData.get("logoId"),
			charset: formData.get("charset"),
			title: formData.get("title"),
			text: formData.get("text"),
			showcase_image: formData.get("showcase_imageId"),
			maintenance: formData.get("maintenance"),
			address: formData.get("address"),
			language: formData.get("language"),
			google_api: formData.get("google_api"),
			calendar: {
				availableDays: formData.getAll("available_days"),
				timeRange: {
					start: formData.get("start_range"),
					end: formData.get("end_range"),
				},
			},
			social: {
				facebook: formData.get("facebook"),
				twitter: formData.get("twitter"),
				youtube: formData.get("youtube"),
				instagram: formData.get("instagram"),
			},
			ads: {
				first: formData.get("first_ad"),
				second: formData.get("second_ad"),
				third: formData.get("third_ad"),
				fourth: formData.get("fourth_ad"),
			},
			scripts: {
				head: formData.get("script_head"),
				footer: formData.get("script_footer"),
			},
		};

		const res = await fetchurl(
			`/noadmin/settings/${object?.data?._id}`,
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
		toast.success(`Setting updated`);
		router.push(`/noadmin/settings`);
	};

	const fileField = (field) => {
		const value = files[field];
		const kind = guessKind(value.url);
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
						placeholder="Pick a file from Files"
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
					{isDirty(field) && (
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => resetField(field)}
							title={"Undo " + FIELD_LABELS[field] + " change"}
						>
							<i className="fa-solid fa-xmark align-middle" />
							<span className="visually-hidden">
								{"Undo " + FIELD_LABELS[field] + " change"}
							</span>
						</button>
					)}
					{(value.url || value.id) && (
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={() => clearField(field)}
							title={"Clear " + FIELD_LABELS[field]}
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
								crossOrigin="anonymous"
							/>
						) : (
							<i className="fa-solid fa-file" />
						)}
						{/* <span className="text-truncate">
							{value.name || value.url}
							{value.id ? " · " + value.id : " · manual location"}
						</span> */}
					</div>
				) : (
					<div className="mb-3 small text-body-secondary">No file selected</div>
				)}
			</>
		);
	};

	const visibleFiles = fileState.items.filter((item) => fileUrlOf(item));

	return (
		<>
			<form key={object?.data?._id} className="row" onSubmit={upgradeSetting}>
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
					{fileField("showcase_image")}
					<label htmlFor="text" className="form-label">
						Text
					</label>
					<MyTextArea
						auth={auth}
						token={token}
						id="text"
						name="text"
						defaultValue={object?.data?.text}
						onModel="Setting"
						advancedTextEditor={false}
						customPlaceholder="No description"
						charactersLimit={99999}
						isRequired={true}
					/>
					<div className="row">
						<div className="col">
							<label htmlFor="author" className="form-label">
								Author
							</label>
							<input
								id="author"
								name="author"
								defaultValue={object?.data?.author}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="author_email" className="form-label">
								Author Email
							</label>
							<input
								id="author_email"
								name="author_email"
								defaultValue={object?.data?.author_email}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label htmlFor="site_url" className="form-label">
								Site Url
							</label>
							<input
								id="site_url"
								name="site_url"
								defaultValue={object?.data?.site_url}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="home_url" className="form-label">
								Home Url
							</label>
							<input
								id="home_url"
								name="home_url"
								defaultValue={object?.data?.home_url}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">{fileField("favicon")}</div>
						<div className="col">{fileField("logo")}</div>
						<div className="col">
							<label htmlFor="charset" className="form-label">
								Charset
							</label>
							<input
								id="charset"
								name="charset"
								defaultValue={object?.data?.charset}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="maintenance" className="form-label">
								Maintenance Mode
							</label>
							<select
								id="maintenance"
								name="maintenance"
								defaultValue={object?.data?.maintenance.toString()}
								className="form-select"
							>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						</div>
					</div>
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
					<label htmlFor="language" className="form-label">
						Language
					</label>
					<input
						id="language"
						name="language"
						defaultValue={object?.data?.language}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
					<div className="row">
						<div className="col">
							<label htmlFor="facebook" className="form-label">
								Facebook
							</label>
							<input
								id="facebook"
								name="facebook"
								defaultValue={object?.data?.social?.facebook}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="twitter" className="form-label">
								Twitter
							</label>
							<input
								id="twitter"
								name="twitter"
								defaultValue={object?.data?.social?.twitter}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="youtube" className="form-label">
								YouTube
							</label>
							<input
								id="youtube"
								name="youtube"
								defaultValue={object?.data?.social?.youtube}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="instagram" className="form-label">
								Instagram
							</label>
							<input
								id="instagram"
								name="instagram"
								defaultValue={object?.data?.social?.instagram}
								type="text"
								className="form-control mb-3"
								placeholder=""
							/>
						</div>
					</div>
					<label htmlFor="google_api" className="form-label">
						Google API
					</label>
					<input
						id="google_api"
						name="google_api"
						defaultValue={object?.data?.google_api}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
					<div className="row">
						<h1>Calendar</h1>
						<div className="col">
							<label htmlFor="available_days" className="form-label">
								Available Days
							</label>
							<select
								id="available_days"
								name="available_days"
								defaultValue={[object?.data?.calendar?.availableDays]}
								className="form-select"
								multiple
							>
								<option value={`0`}>Sunday</option>
								<option value={`1`}>Monday</option>
								<option value={`2`}>Tuesday</option>
								<option value={`3`}>Wednesday</option>
								<option value={`4`}>Thursday</option>
								<option value={`5`}>Friday</option>
								<option value={`6`}>Saturday</option>
							</select>
						</div>
						<div className="col">
							<label htmlFor="start_range" className="form-label">
								Start Range
							</label>
							<input
								id="start_range"
								name="start_range"
								defaultValue={object?.data?.calendar?.timeRange?.start}
								type="text"
								className="form-control mb-3"
								placeholder="00:00"
							/>
							<label htmlFor="end_range" className="form-label">
								End Range
							</label>
							<input
								id="end_range"
								name="end_range"
								defaultValue={object?.data?.calendar?.timeRange?.end}
								type="text"
								className="form-control mb-3"
								placeholder="23:59"
							/>
						</div>
					</div>
					<div className="row">
						<h1>Ads</h1>
						<div className="col">
							<label htmlFor="first_ad" className="form-label">
								First
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="first_ad"
								name="first_ad"
								defaultValue={object?.data?.ads?.first}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder=""
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
						<div className="col">
							<label htmlFor="second_ad" className="form-label">
								Second
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="second_ad"
								name="second_ad"
								defaultValue={object?.data?.ads?.second}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder=""
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
						<div className="col">
							<label htmlFor="third_ad" className="form-label">
								Third
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="third_ad"
								name="third_ad"
								defaultValue={object?.data?.ads?.third}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder=""
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
						<div className="col">
							<label htmlFor="fourth_ad" className="form-label">
								Fourth
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="fourth_ad"
								name="fourth_ad"
								defaultValue={object?.data?.ads?.fourth}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder=""
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
					</div>
					<div className="row">
						<h1>Scripts</h1>
						<div className="col">
							<label htmlFor="script_head" className="form-label">
								Head
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="script_head"
								name="script_head"
								defaultValue={object?.data?.scripts?.head}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder="Paste some JS code here"
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
						<div className="col">
							<label htmlFor="script_footer" className="form-label">
								Footer
							</label>
							<MyTextArea
								auth={undefined}
								token={undefined}
								id="script_footer"
								name="script_footer"
								defaultValue={object?.data?.scripts?.footer}
								onModel="Setting"
								advancedTextEditor={false}
								customPlaceholder="Paste some JS code here"
								charactersLimit={9999}
								isRequired={false}
							/>
						</div>
					</div>
					<br />
					<FormButtons />
				</div>
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
						<div className="input-group input-group-sm mb-3">
							<span className="input-group-text">
								<i
									className="fa-solid fa-magnifying-glass"
									aria-hidden="true"
								/>
							</span>
							<input
								type="search"
								className="form-control"
								placeholder="Search image files by name..."
								aria-label="Search image files by name"
								value={fileSearch}
								onChange={onSearchChange}
								onKeyDown={onSearchKeyDown}
							/>
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
											? `No image files match \u201C${fileState.keyword}\u201D.`
											: "You don't have any image files yet."}
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
															className="fa-solid fa-file fs-1 text-body-secondary"
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

export default UpdateSettingForm;
