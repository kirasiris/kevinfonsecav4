"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import {
	fileNameOf,
	fileUrlOf,
	guessKind,
	idOf,
} from "@/helpers/filemanagerhelpers";
import {
	FileBrowserModal,
	useFileBrowser,
} from "@/components/global/filemanagerui";

const FIELD_LABELS = {
	showcase_image: "Showcase Image",
	favicon: "Favicon",
	logo: "Logo",
};

const FIELDS = ["showcase_image", "favicon", "logo"];

const EMPTY_FIELD = { url: "", id: "", name: "" };

const CreateSettingForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();
	const submittingRef = useRef(false);

	// FormButtons reads useFormStatus, which only tracks `action` forms, so this
	// onSubmit form has to hand it the pending state itself.
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [files, setFiles] = useState({
		showcase_image: EMPTY_FIELD,
		favicon: EMPTY_FIELD,
		logo: EMPTY_FIELD,
	});

	// Every field on this form is an image, so the browser only lists images.
	const fileBrowser = useFileBrowser({ formatType: "image" });
	const [fileTarget, setFileTarget] = useState("");

	const openFileManager = (target) => {
		setFileTarget(target);
		fileBrowser.openFileManager();
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
		fileBrowser.closeFileManager();
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
		setIsSubmitting(true);
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
		).catch((err) => ({
			status: "error",
			message: err && err.message,
		}));

		if (!res || res.status === "error" || res.status === "fail") {
			toast.error((res && res.message) || "Something went wrong");
			setIsSubmitting(false);
			submittingRef.current = false;
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
					<div className="mb-3" />
				)}
			</>
		);
	};

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
					<FormButtons pending={isSubmitting} />
				</div>
			</form>
			<FileBrowserModal
				browser={fileBrowser}
				title={
					"File Manager" + (fileTarget ? " — " + FIELD_LABELS[fileTarget] : "")
				}
				noun="image"
				currentId={fileTarget ? files[fileTarget].id : ""}
				onApply={applyFile}
			/>
		</>
	);
};

export default CreateSettingForm;
