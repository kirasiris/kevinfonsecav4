"use client";
import { useEffect, useRef, useState } from "react";
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

const normalizeFileValue = (raw) => {
	if (!raw || typeof raw !== "object") return EMPTY_FIELD;
	return {
		url: fileUrlOf(raw),
		id: raw._id ? String(raw._id) : "",
		name: fileNameOf(raw),
		kind: kindOf(raw),
	};
};

const hydrateFields = (data) => ({
	credentialURL: normalizeFileValue(data && data.credentialURL),
});

// Dates are stored at UTC midnight, so format in UTC or the day can shift.
const toDateInput = (value) =>
	value ? new Date(value).toLocaleDateString("en-CA", { timeZone: "UTC" }) : "";

const UpdateCertificateForm = ({
	token = {},
	auth = {},
	object = {},
	params = {},
}) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);

	// FormButtons reads useFormStatus, which only tracks `action` forms, so this
	// onSubmit form has to hand it the pending state itself.
	const [isSubmitting, setIsSubmitting] = useState(false);

	const certificateId = object?.data?._id;

	// Prefilled synchronously so populated refs never flash an empty input
	const [files, setFiles] = useState(() => hydrateFields(object?.data));

	const fileBrowser = useFileBrowser({ kinds: FILE_KINDS });
	const [fileTarget, setFileTarget] = useState("");

	/* ---- Prefill from the DB record ---------------------------------------- */

	// Re-seed the controlled inputs if the record arrives (or changes) after mount
	useEffect(() => {
		if (!object?.data) return;
		setFiles(hydrateFields(object.data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [certificateId]);

	/* ---- File manager ------------------------------------------------------ */

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

	const resetField = (field) => {
		const original = normalizeFileValue(object?.data?.[field]);
		setFiles((prev) => ({ ...prev, [field]: original }));
	};

	// Compares urls too, so a typed location (no id) still offers Undo.
	const isDirty = (field) => {
		const original = normalizeFileValue(object?.data?.[field]);
		return files[field].id !== original.id || files[field].url !== original.url;
	};

	const upgradeCertificate = async (e) => {
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
			`/noadmin/companies/${params.id}/certificates/${certificateId}`,
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
			submittingRef.current = false;
			if (isMountedRef.current) setIsSubmitting(false);
			return;
		}
		toast.success(`Certificate updated`);
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
							<i className="fa-solid fa-rotate-left align-middle" />
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
					<div className="mb-3 small text-body-secondary">No file selected</div>
				)}
			</>
		);
	};

	return (
		<>
			<form key={certificateId} onSubmit={upgradeCertificate}>
				<div className="row">
					<div className="col">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							defaultValue={object?.data?.name}
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
							defaultValue={object?.data?.organization}
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
							defaultValue={toDateInput(object?.data?.from)}
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
							defaultValue={toDateInput(object?.data?.to)}
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
							defaultValue={String(Boolean(object?.data?.current))}
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
							defaultValue={object?.data?.credentialId}
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
							defaultValue={object?.data?.text}
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

export default UpdateCertificateForm;
