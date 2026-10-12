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
import AdminFeaturedImage from "./adminfeaturedimage";
import { fetchurl } from "@/helpers/setTokenOnServer";

const guessKind = (url, mime) => {
	const u = (url || "").toLowerCase();
	if (mime) {
		if (mime.indexOf("image") === 0) return "image";
		if (mime.indexOf("video") === 0) return "video";
		if (mime.indexOf("audio") === 0) return "audio";
	}
	if (/\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/.test(u)) return "image";
	if (/\.(mp4|webm|ogg|mov)(\?|$)/.test(u)) return "video";
	if (/\.(mp3|wav|m4a|aac|flac)(\?|$)/.test(u)) return "audio";
	return "file";
};

const fileUrlOf = (item) => {
	const loc = (item && item.location) || {};
	return loc.secure_location || loc.insecure_location || loc.aws_location || "";
};

const fileNameOf = (item) => {
	if (!item) return "file";
	const loc = item.location || {};
	return (
		item.title ||
		(item.resourceId && item.resourceId.title) ||
		loc.filename ||
		"file"
	);
};

const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "object") {
		const id = value._id || value.id || "";
		return id ? String(id) : "";
	}
	return String(value);
};

const toIdList = (value) =>
	(Array.isArray(value) ? value : value ? [value] : [])
		.map(idOf)
		.filter(Boolean);

const EMPTY_LIST = [];

const toCategoryArray = (value) => {
	if (Array.isArray(value)) return value;
	if (value && Array.isArray(value.data)) return value.data;
	return [];
};

const mergeCategories = (fromProps, created) => {
	const seen = new Set();
	const out = [];
	for (const c of [...fromProps, ...created]) {
		const id = idOf(c);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		out.push(c);
	}
	return out;
};

const flattenCategoryTree = (list) => {
	const byId = new Map();
	for (const c of list) {
		const id = idOf(c);
		if (id && !byId.has(id)) byId.set(id, c);
	}
	const children = new Map();
	const roots = [];
	byId.forEach((c, id) => {
		const parentId = idOf(c.parentId);
		if (parentId && parentId !== id && byId.has(parentId)) {
			if (!children.has(parentId)) children.set(parentId, []);
			children.get(parentId).push(c);
		} else {
			roots.push(c);
		}
	});
	const byTitle = (a, b) =>
		String(a.title || "").localeCompare(String(b.title || ""), undefined, {
			sensitivity: "base",
		});

	const out = [];
	const seen = new Set();
	const walk = (c, depth) => {
		const id = idOf(c);
		if (seen.has(id)) return;
		seen.add(id);
		out.push({
			id,
			title: c.title || "Untitled",
			depth,
			parentId: idOf(c.parentId),
		});
		(children.get(id) || []).sort(byTitle).forEach((k) => walk(k, depth + 1));
	};
	roots.sort(byTitle).forEach((r) => walk(r, 0));
	byId.forEach((c, id) => {
		if (!seen.has(id)) walk(c, 0);
	});
	return out;
};

const indentLabel = (node) => "\u2014\u00A0".repeat(node.depth) + node.title;

const isFailedResponse = (res) =>
	!res ||
	res instanceof Error ||
	res.status === "error" ||
	res.status === "fail" ||
	res.success === false;

const AdminSidebar = ({
	displayCategoryField = true,
	displayAvatar = true,
	avatar = "",
	avatarFormat = "image",
	status = "draft",
	fullWidth = false,
	password = "",
	featured = false,
	commented = false,
	embedding = false,
	category = undefined,
	categories = EMPTY_LIST,
	multiple_categories = false,
	allowCategoryCreation = true,
	categoryType = undefined,
}) => {
	// avatar.avatar is already the populated file document, so no fetch is needed.
	const initialFile =
		avatar?.avatar && typeof avatar.avatar === "object" ? avatar.avatar : null;
	const initialFileId = idOf(initialFile);

	const fieldId = useId();
	const wrapperRef = useRef(null);
	const [featuredFile, setFeaturedFile] = useState(initialFile);

	// Latest seed, read by the reset handler without re-subscribing every render.
	const initialFileRef = useRef(initialFile);
	initialFileRef.current = initialFile;
	// Whether the user has picked or cleared a file since the last seed.
	const touchedRef = useRef(false);

	const [showFiles, setShowFiles] = useState(false);
	const [fileSelection, setFileSelection] = useState(null);
	const [fileSearch, setFileSearch] = useState("");
	const [fileState, setFileState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
		loading: false,
		error: "",
	});

	const isMountedRef = useRef(true);
	// Only the newest page request may write state; clicking pages quickly could
	// otherwise let a slow earlier response overwrite the page the user is on.
	const requestIdRef = useRef(0);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			requestIdRef.current++;
		};
	}, []);

	// On an edit page the record often arrives a render late; adopt it unless the
	// user has already made a choice of their own.
	useEffect(() => {
		if (touchedRef.current) return;
		setFeaturedFile(initialFileRef.current);
	}, [initialFileId]);

	// The hidden input is controlled, so a native form reset would not touch our state.
	// The wrapper only mounts with the avatar block, hence the dependency.
	useEffect(() => {
		const form = wrapperRef.current?.closest("form");
		if (!form) return;
		const onReset = () => {
			touchedRef.current = false;
			setFeaturedFile(initialFileRef.current);
		};
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, [displayAvatar]);

	const loadFiles = async (page) => {
		const requestId = ++requestIdRef.current;
		setFileState((s) => ({ ...s, page, loading: true, error: "" }));
		try {
			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const json = await fetchurl(
				`/global/files?page=${page}&limit=28`,
				"GET",
				"no-cache",
				{},
				null,
				false,
				false,
			);
			if (!json || !Array.isArray(json.data)) {
				throw new Error((json && json.message) || "Failed to load files");
			}
			if (!isMountedRef.current || requestId !== requestIdRef.current) return;
			setFileState({
				items: json.data,
				page: (json.pagination && json.pagination.current) || page,
				totalPages: (json.pagination && json.pagination.totalpages) || 1,
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
		loadFiles(page);
	};

	// Refetch on every open so files uploaded since the last open show up.
	const openFileManager = () => {
		setFileSelection(null);
		setFileSearch("");
		setShowFiles(true);
		loadFiles(fileState.page);
	};

	const closeFileManager = useCallback(() => {
		// Drop any in-flight response; the next open fetches fresh anyway.
		requestIdRef.current++;
		setFileState((s) => (s.loading ? { ...s, loading: false } : s));
		setShowFiles(false);
	}, []);

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
		setFeaturedFile(item);
		closeFileManager();
		setFileSelection(null);
	};

	const clearFile = () => {
		touchedRef.current = true;
		setFeaturedFile(null);
	};

	const fq = fileSearch.trim().toLowerCase();
	const visibleFiles = fileState.items.filter((item) => {
		if (!fileUrlOf(item)) return false;
		return !fq || fileNameOf(item).toLowerCase().indexOf(fq) !== -1;
	});

	const featuredId = idOf(featuredFile);
	const selectedId = idOf(fileSelection);

	return (
		<>
			{/* HERE GOES THE AVATAR */}
			{displayAvatar && (
				<div ref={wrapperRef}>
					{/* Keyed so <audio> picks up a new <source>; it ignores src changes otherwise. */}
					<AdminFeaturedImage
						key={featuredId || "none"}
						avatar={featuredFile || ""}
						avatarFormat={avatarFormat}
					/>
					<label htmlFor={fieldId} className="form-label">
						Featured Image
					</label>
					<div className="input-group mb-3">
						<input
							id={fieldId}
							type="text"
							className="form-control"
							value={featuredFile ? fileNameOf(featuredFile) : ""}
							placeholder="No file selected"
							readOnly
						/>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={openFileManager}
							title="Pick featured image from files"
						>
							<i className="fa-solid fa-folder-open me-1" aria-hidden="true" />
							Files
						</button>
						{featuredFile && (
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={clearFile}
							>
								<i
									className="fa-solid fa-xmark align-middle"
									aria-hidden="true"
								/>
								<span className="visually-hidden">Clear featured image</span>
							</button>
						)}
					</div>
					<input type="hidden" name="file" value={featuredId} readOnly />

					{/* Portaled out of the parent <form> so Enter in the filter box can't submit it. */}
					{showFiles &&
						createPortal(
							<BootstrapModal
								title="File Manager — Featured Image"
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
											type="text"
											className="form-control"
											placeholder="Filter loaded files by name..."
											aria-label="Filter loaded files by name"
											value={fileSearch}
											onChange={(e) => setFileSearch(e.target.value)}
										/>
									</div>
									{fileState.loading && (
										<ModalSpinner label="Loading files..." />
									)}
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
										<div
											className="row g-3"
											role="radiogroup"
											aria-label="Files"
										>
											{visibleFiles.length === 0 && (
												<div className="col-12 text-center text-body-secondary py-4">
													No matching files on this page.
												</div>
											)}
											{visibleFiles.map((item, i) => {
												const url = fileUrlOf(item);
												const name = fileNameOf(item);
												const kind = guessKind(url, item.mimetype);
												const itemId = idOf(item);
												const isSelected =
													!!selectedId && selectedId === itemId;
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
																			(kind === "video"
																				? "fa-film"
																				: kind === "audio"
																					? "fa-music"
																					: "fa-file")
																		}
																	/>
																</div>
															)}
															<div className="card-body p-2">
																<p
																	className="small text-truncate mb-0"
																	title={name}
																>
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
							</BootstrapModal>,
							document.body,
						)}
				</div>
			)}
			<label htmlFor="status" className="form-label">
				Status
			</label>
			<select
				id="status"
				name="status"
				defaultValue={status}
				className="form-control mb-3"
			>
				<option value={`draft`}>Draft</option>
				<option value={`published`}>Published</option>
				<option value={`trash`}>Trash</option>
				<option value={`scheduled`}>Scheduled</option>
				<option value={`archived`}>Archived - Stripe Objects</option>
			</select>
			{fullWidth && (
				<>
					<label htmlFor="fullWidth" className="form-label">
						Full Width
					</label>
					<select
						id="fullWidth"
						name="fullWidth"
						defaultValue={String(fullWidth)}
						className="form-control mb-3"
					>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</>
			)}
			{password !== "" && password !== undefined && password !== null && (
				<>
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						id="password"
						name="password"
						defaultValue={password}
						type="password"
						className="form-control mb-3"
						placeholder="******"
						autoComplete="new-password"
					/>
				</>
			)}
			{featured && (
				<>
					<label htmlFor="featured" className="form-label">
						Featured
					</label>
					<select
						id="featured"
						name="featured"
						defaultValue={String(featured)}
						className="form-control mb-3"
					>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</>
			)}
			{commented && (
				<>
					<label htmlFor="commented" className="form-label">
						Commented
					</label>
					<select
						id="commented"
						name="commented"
						defaultValue={String(commented)}
						className="form-control mb-3"
					>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</>
			)}
			{embedding && (
				<>
					<label htmlFor="embedding" className="form-label">
						Embedding
					</label>
					<select
						id="embedding"
						name="embedding"
						defaultValue={String(embedding)}
						className="form-control mb-3"
					>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</>
			)}
			{/* HERE GOES THE CATEGORIES SELECT */}
			{displayCategoryField && (
				<CategoryField
					category={category}
					categories={categories}
					multiple={multiple_categories}
					allowCreate={allowCategoryCreation}
					categoryType={categoryType}
				/>
			)}
		</>
	);
};

function CategoryField({
	category,
	categories,
	multiple,
	allowCreate,
	categoryType,
}) {
	const baseId = useId();
	const panelId = baseId + "-new-category";
	const titleId = baseId + "-new-title";
	const descriptionId = baseId + "-new-description";
	const childToggleId = baseId + "-new-is-child";
	const parentSelectId = baseId + "-new-parent";

	const wrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const isMountedRef = useRef(true);
	const creatingRef = useRef(false);
	const resetTimerRef = useRef(0);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			clearTimeout(resetTimerRef.current);
		};
	}, []);

	const [created, setCreated] = useState([]);
	const propList = toCategoryArray(categories);
	const list = useMemo(
		() => mergeCategories(propList, created),
		[propList, created],
	);
	const tree = useMemo(() => flattenCategoryTree(list), [list]);

	// Selection is controlled so a newly created category can be selected for the
	// user. The seed is keyed by its ids, because `category` is often a fresh
	// object on every parent render.
	const defaults = toIdList(category);
	const defaultsKey = defaults.join(",");
	const defaultsRef = useRef(defaults);
	defaultsRef.current = defaults;
	const touchedRef = useRef(false);
	const [selected, setSelected] = useState(defaults);

	useEffect(() => {
		if (touchedRef.current) return;
		setSelected(defaultsRef.current);
	}, [defaultsKey]);

	const [showAdd, setShowAdd] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [isChild, setIsChild] = useState(false);
	const [newParent, setNewParent] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");
	const [createNotice, setCreateNotice] = useState("");

	// A native reset runs right after the "reset" event and would overwrite the
	// controlled <select>, so restore state on the next task instead. New
	// categories stay in the list because they already exist in the DB.
	useEffect(() => {
		const form = wrapperRef.current?.closest("form");
		if (!form) return;
		const onReset = () => {
			clearTimeout(resetTimerRef.current);
			resetTimerRef.current = setTimeout(() => {
				if (!isMountedRef.current) return;
				touchedRef.current = false;
				setSelected([...defaultsRef.current]);
				setShowAdd(false);
				setNewTitle("");
				setNewDescription("");
				setIsChild(false);
				setNewParent("");
				setCreateError("");
				setCreateNotice("");
			}, 0);
		};
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, []);

	const onSelectChange = (e) => {
		touchedRef.current = true;
		setSelected(
			multiple
				? Array.from(e.target.selectedOptions, (o) => o.value).filter(Boolean)
				: e.target.value
					? [e.target.value]
					: [],
		);
	};

	const toggleAddPanel = () => {
		setShowAdd((open) => !open);
		setCreateError("");
		setCreateNotice("");
	};

	// Focus once the panel exists; an effect avoids reaching for a node that
	// hasn't mounted yet.
	useEffect(() => {
		if (showAdd) titleInputRef.current?.focus();
	}, [showAdd]);

	const submitNewCategory = async () => {
		if (creatingRef.current) return;
		const title = newTitle.trim();
		if (!title) {
			setCreateError("Please enter a name for the new category.");
			titleInputRef.current?.focus();
			return;
		}
		if (isChild && !newParent) {
			setCreateError(
				"Choose a parent category, or untick \u201CMake this a subcategory\u201D.",
			);
			return;
		}
		const parentKey = isChild ? newParent : "";
		const lower = title.toLowerCase();
		const duplicate = tree.some(
			(n) => n.title.trim().toLowerCase() === lower && n.parentId === parentKey,
		);
		if (duplicate) {
			setCreateError(
				`A category named \u201C${title}\u201D already exists ${
					isChild ? "under that parent" : "at the top level"
				}.`,
			);
			return;
		}

		creatingRef.current = true;
		setCreating(true);
		setCreateError("");
		setCreateNotice("");
		try {
			const body = {
				title,
				// The model requires `text`; fall back to the title when no description is given.
				text: newDescription.trim() || title,
				mentions: [],
				tags: [],
				deletable: false,
				status: "published",
			};
			if (isChild) body.parentId = newParent;
			if (categoryType) body.categoryType = categoryType;

			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const res = await fetchurl(
				`/noadmin/categories`,
				"POST",
				"no-cache",
				body,
				undefined,
				false,
				false,
			);
			if (!isMountedRef.current) return;
			if (isFailedResponse(res)) {
				throw new Error(
					(res && res.message) || "Couldn't create the category.",
				);
			}
			const doc =
				res.data && typeof res.data === "object" && !Array.isArray(res.data)
					? res.data
					: res;
			const newId = idOf(doc);
			if (!newId) {
				throw new Error(
					"The category was created, but the API didn't return its id. Reload the page to see it.",
				);
			}
			const record = {
				...doc,
				_id: newId,
				title: doc.title || title,
				parentId: doc.parentId ?? (isChild ? newParent : undefined),
			};

			setCreated((prev) => [...prev.filter((c) => idOf(c) !== newId), record]);
			touchedRef.current = true;
			setSelected((prev) =>
				multiple ? (prev.includes(newId) ? prev : [...prev, newId]) : [newId],
			);
			setNewTitle("");
			setNewDescription("");
			setCreateNotice(`\u201C${record.title}\u201D was added and selected.`);
			titleInputRef.current?.focus();
		} catch (err) {
			if (!isMountedRef.current) return;
			setCreateError((err && err.message) || "Couldn't create the category.");
		} finally {
			creatingRef.current = false;
			if (isMountedRef.current) setCreating(false);
		}
	};

	// The panel lives inside the parent <form>, so Enter must not submit it.
	const onTitleKeyDown = (e) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		if (e.nativeEvent.isComposing || e.keyCode === 229) return;
		submitNewCategory();
	};

	const singleValue = selected[0] || "";

	return (
		<div ref={wrapperRef}>
			<label htmlFor="category" className="form-label">
				Category
			</label>
			<select
				id="category"
				name="category"
				value={multiple ? selected : singleValue}
				onChange={onSelectChange}
				className="form-select"
				multiple={multiple}
				size={multiple ? Math.min(Math.max(tree.length, 4), 10) : undefined}
			>
				{!multiple && <option value="">Select category</option>}
				{tree.map((node) => (
					<option key={node.id} value={node.id}>
						{indentLabel(node)}
					</option>
				))}
			</select>
			{multiple && (
				<div className="form-text">
					Hold Ctrl (Cmd on Mac) to select more than one.
				</div>
			)}

			{allowCreate && (
				<>
					<button
						type="button"
						className="btn btn-link btn-sm px-0 mt-1"
						aria-expanded={showAdd}
						aria-controls={panelId}
						onClick={toggleAddPanel}
					>
						<i
							className={"fa-solid me-1 " + (showAdd ? "fa-minus" : "fa-plus")}
							aria-hidden="true"
						/>
						Add new category
					</button>

					{/* No `name` on these fields and no native `required`, so they never
					    leak into or block the parent form's submit. */}
					{showAdd && (
						<div id={panelId} className="border rounded p-3 mt-1">
							<label htmlFor={titleId} className="form-label">
								New category name
							</label>
							<input
								ref={titleInputRef}
								id={titleId}
								type="text"
								className={
									"form-control mb-2" +
									(createError && !newTitle.trim() ? " is-invalid" : "")
								}
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								onKeyDown={onTitleKeyDown}
								placeholder="e.g. JavaScript"
								aria-required="true"
								maxLength={120}
								disabled={creating}
							/>

							<label htmlFor={descriptionId} className="form-label">
								Description{" "}
								<span className="text-body-secondary">(optional)</span>
							</label>
							<textarea
								id={descriptionId}
								className="form-control mb-2"
								rows={2}
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
								disabled={creating}
							/>

							<div className="form-check mb-2">
								<input
									id={childToggleId}
									type="checkbox"
									className="form-check-input"
									checked={isChild}
									onChange={(e) => {
										setIsChild(e.target.checked);
										if (!e.target.checked) setNewParent("");
										setCreateError("");
									}}
									disabled={creating || tree.length === 0}
								/>
								<label htmlFor={childToggleId} className="form-check-label">
									Make this a subcategory
								</label>
							</div>

							{isChild && (
								<>
									<label htmlFor={parentSelectId} className="form-label">
										Parent category <span className="text-danger">*</span>
									</label>
									<select
										id={parentSelectId}
										className={
											"form-select mb-2" +
											(createError && !newParent ? " is-invalid" : "")
										}
										value={newParent}
										onChange={(e) => {
											setNewParent(e.target.value);
											setCreateError("");
										}}
										aria-required="true"
										disabled={creating}
									>
										<option value="">&mdash; Choose parent &mdash;</option>
										{tree.map((node) => (
											<option key={node.id} value={node.id}>
												{indentLabel(node)}
											</option>
										))}
									</select>
								</>
							)}

							{createError && (
								<div
									className="alert alert-danger py-2 small mb-2"
									role="alert"
								>
									{createError}
								</div>
							)}
							<div className="visually-hidden" aria-live="polite">
								{createNotice}
							</div>
							{createNotice && !createError && (
								<div className="small text-success mb-2" aria-hidden="true">
									<i className="fa-solid fa-check me-1" />
									{createNotice}
								</div>
							)}

							<div className="d-flex gap-2">
								<button
									type="button"
									className="btn btn-primary btn-sm"
									onClick={submitNewCategory}
									disabled={creating}
								>
									{creating ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-1"
												aria-hidden="true"
											/>
											Adding...
										</>
									) : (
										"Add category"
									)}
								</button>
								<button
									type="button"
									className="btn btn-outline-secondary btn-sm"
									onClick={toggleAddPanel}
									disabled={creating}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</>
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

export default AdminSidebar;
