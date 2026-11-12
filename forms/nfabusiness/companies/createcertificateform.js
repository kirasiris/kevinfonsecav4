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
	kindOf,
	readJsonList,
} from "@/helpers/filemanagerhelpers";
import {
	FileBrowserModal,
	useFileBrowser,
	useIsMounted,
} from "@/components/global/filemanagerui";

// The files API has no OR filter (`format_type=image,application` fails), so
// each kind gets its own exact query and the modal switches between them.
const FILE_KINDS = {
	image: {
		label: "Images",
		noun: "image",
		icon: "fa-image",
		query: "format_type=image",
	},
	pdf: { label: "PDFs", noun: "PDF", icon: "fa-file-pdf", query: "format=pdf" },
};

// Storage URLs don't always end in ".pdf", so the kind recorded when the file
// was picked wins over guessing from the URL.
const displayKindOf = (value) => value.kind || guessKind(value.url);
const pickerKindOf = (value) =>
	displayKindOf(value) === "pdf" ? "pdf" : "image";

const FIELD_LABELS = {
	credentialURL: "Credential Copy",
};

const FIELDS = ["credentialURL"];

const EMPTY_FIELD = { url: "", id: "", name: "", kind: "" };

const CreateCertificateForm = ({ token = {}, auth = {}, params = {} }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);

	// FormButtons reads useFormStatus, which only tracks `action` forms, so this
	// onSubmit form has to hand it the pending state itself.
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [files, setFiles] = useState({
		credentialURL: EMPTY_FIELD,
	});

	const fileBrowser = useFileBrowser({ kinds: FILE_KINDS });
	const [fileTarget, setFileTarget] = useState("");

	// Opens on the current file's kind so a saved PDF is visible as "Current".
	const openFileManager = (target) => {
		setFileTarget(target);
		fileBrowser.openFileManager(
			files[target].url ? pickerKindOf(files[target]) : undefined,
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
		fileBrowser.closeFileManager();
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
		setIsSubmitting(true);
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
			mentions: readJsonList(formData, "text_users"),
			tags: readJsonList(formData, "text_hashtags"),
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
			if (isMountedRef.current) setIsSubmitting(false);
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
							defaultValue="false"
							className="form-select mb-3"
						>
							<option value="true">Yes</option>
							<option value="false">No</option>
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
				<FormButtons pending={isSubmitting} />
			</form>
			<FileBrowserModal
				browser={fileBrowser}
				title={
					"File Manager" + (fileTarget ? " — " + FIELD_LABELS[fileTarget] : "")
				}
				currentId={fileTarget ? files[fileTarget].id : ""}
				onApply={applyFile}
			/>
		</>
	);
};

export default CreateCertificateForm;
