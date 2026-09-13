"use client";
import { useEffect, useState } from "react";
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
	if (/\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/.test(u)) return "image";
	if (/\.(mp4|webm|ogg|mov)(\?|$)/.test(u)) return "video";
	if (/\.(mp3|wav|m4a|aac|flac)(\?|$)/.test(u)) return "audio";
	return "file";
};

const fileUrlOf = (item) => {
	const loc = item.location || {};
	return loc.secure_location || loc.insecure_location || loc.aws_location || "";
};

const fileNameOf = (item) => {
	const loc = item.location || {};
	return loc.filename || (item.resourceId && item.resourceId.title) || "file";
};

const FIELD_LABELS = {
	showcase_image: "Showcase Image",
	favicon: "Favicon",
	logo: "Logo",
};

const EMPTY_FIELD = { url: "", id: "", name: "" };

const CreateSettingForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const [files, setFiles] = useState({
		showcase_image: EMPTY_FIELD,
		favicon: EMPTY_FIELD,
		logo: EMPTY_FIELD,
	});

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

	const openFileManager = (target) => {
		setFileTarget(target);
		setFileSelection(null);
		setFileSearch("");
		setShowFiles(true);
		if (!fileState.items.length) loadFiles(1);
	};

	const loadFiles = async (page) => {
		setFileState((s) => ({ ...s, loading: true, error: "" }));
		try {
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
			setFileState({
				items: json.data || [],
				page: (json.pagination && json.pagination.current) || page,
				totalPages: (json.pagination && json.pagination.totalpages) || 1,
				loading: false,
				error: "",
			});
		} catch (err) {
			setFileState((s) => ({ ...s, loading: false, error: err.message }));
		}
	};

	const toggleFileSelection = (item) => {
		const url = fileUrlOf(item);
		if (!url) return;
		setFileSelection((prev) =>
			prev && prev.url === url
				? null
				: {
						id: item._id || "",
						url,
						name: fileNameOf(item),
						kind: guessKind(url),
					},
		);
	};

	const useSelectedFile = () => {
		if (!fileSelection || !fileTarget) return;
		setFiles((prev) => ({
			...prev,
			[fileTarget]: {
				url: fileSelection.url,
				id: fileSelection.id,
				name: fileSelection.name,
			},
		}));
		setShowFiles(false);
		setFileSelection(null);
		setFileTarget("");
	};

	const setFieldUrl = (field, url) => {
		setFiles((prev) => ({ ...prev, [field]: { url, id: "", name: "" } }));
	};

	const clearField = (field) => {
		setFiles((prev) => ({ ...prev, [field]: EMPTY_FIELD }));
	};

	const addSetting = async (e) => {
		e.preventDefault();
		setBtnText("...");
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
			`/noadmin/settings`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		toast.success(`Setting created`);
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
							<i className="fa-solid fa-xmark" />
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
					<div className="mb-3" />
				)}
			</>
		);
	};

	const fq = fileSearch.trim().toLowerCase();
	const visibleFiles = fileState.items.filter((item) => {
		const url = fileUrlOf(item);
		if (!url) return false;
		return !fq || fileNameOf(item).toLowerCase().indexOf(fq) !== -1;
	});

	return (
		<>
			<form className="row" onSubmit={addSetting}>
				<div className="col">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						id="title"
						name="title"
						defaultValue="Untitled"
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
						defaultValue="No description..."
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
								defaultValue="Kevin Uriel Fonseca"
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
								defaultValue="kebin1421@hotmail.com"
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
								defaultValue="/"
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
								defaultValue="/"
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
								defaultValue="UTF-8"
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
								defaultValue={false}
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
						defaultValue=""
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
						defaultValue="en-US"
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
						defaultValue=""
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
								defaultValue={[""]}
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
								defaultValue=""
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
					onClose={() => setShowFiles(false)}
				>
					<div className="modal-body">
						<div className="input-group input-group-sm mb-3">
							<span className="input-group-text">
								<i className="fa-solid fa-magnifying-glass" />
							</span>
							<input
								type="text"
								className="form-control"
								placeholder="Filter loaded files by name..."
								value={fileSearch}
								onChange={(e) => setFileSearch(e.target.value)}
							/>
						</div>
						{fileState.loading && <ModalSpinner label="Loading files..." />}
						{fileState.error && (
							<div className="alert alert-danger" role="alert">
								{fileState.error}
							</div>
						)}
						{!fileState.loading && !fileState.error && (
							<div className="row g-3" role="radiogroup" aria-label="Files">
								{visibleFiles.length === 0 && (
									<div className="col-12 text-center text-body-secondary py-4">
										No matching files on this page.
									</div>
								)}
								{visibleFiles.map((item, i) => {
									const url = fileUrlOf(item);
									const name = fileNameOf(item);
									const kind = guessKind(url);
									const isSelected =
										!!fileSelection && fileSelection.url === url;
									return (
										<div
											className="col-6 col-md-4 col-lg-3"
											key={item._id || i}
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
												onDoubleClick={() => {
													toggleFileSelection(item);
													useSelectedFile();
												}}
											>
												{isSelected && (
													<span className="badge text-bg-primary position-absolute top-0 end-0 m-2 z-1">
														<i className="fa-solid fa-check" />
													</span>
												)}
												{kind === "image" ? (
													<img
														src={url || "/placeholder.svg"}
														alt={name}
														className="file-thumb"
														style={{ height: 120, objectFit: "cover" }}
														loading="lazy"
														crossOrigin="anonymous"
													/>
												) : (
													<div
														className="file-thumb d-flex align-items-center justify-content-center bg-body-tertiary"
														style={{ height: 120 }}
													>
														<i
															className={
																"fa fs-1 text-body-secondary " +
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
							onPage={loadFiles}
							label="File pages"
						/>
						<div className="d-flex align-items-center gap-2">
							{fileSelection && (
								<small className="text-body-secondary text-truncate d-none d-md-inline">
									{fileSelection.name}
								</small>
							)}
							<button
								type="button"
								className="btn btn-primary btn-sm"
								disabled={!fileSelection}
								onClick={useSelectedFile}
							>
								Use file
							</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								onClick={() => setShowFiles(false)}
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
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKey);
		document.body.classList.add("modal-open");
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.classList.remove("modal-open");
		};
	}, [onClose]);

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
								<i className={"fa-solid fa-" + icon + " me-2"} />
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

function Pagination({ page, totalPages, onPage, label }) {
	const pages = [];
	for (let p = 1; p <= totalPages; p++) pages.push(p);
	return (
		<nav aria-label={label}>
			<ul className="pagination pagination-sm mb-0">
				{pages.map((p) => (
					<li key={p} className={"page-item" + (p === page ? " active" : "")}>
						<button
							type="button"
							className="page-link"
							onClick={() => onPage(p)}
						>
							{p}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default CreateSettingForm;
