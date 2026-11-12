import { fetchurl } from "@/helpers/setTokenOnServer";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const FILES_PER_PAGE = 28;
export const SEARCH_DELAY_MS = 300;

export const FILE_TYPE_MAP = {
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

/* -------------------------------------------------------------------------- */
/* File record helpers                                                        */
/* -------------------------------------------------------------------------- */

// Accepts a populated document or a bare id string.
export const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "object") {
		const id = value._id || value.id || "";
		return id ? String(id) : "";
	}
	return String(value);
};

// A record may hold the populated file or just its id; either way keep an object.
export const toFileObject = (value) => {
	if (!value) return null;
	if (typeof value === "object") return idOf(value) ? value : null;
	return { _id: String(value) };
};

export const fileUrlOf = (item) => {
	const loc = (item && item.location) || {};
	return loc.secure_location || loc.insecure_location || loc.aws_location || "";
};

// `title` is the name the file was uploaded under; `location.filename` is the
// storage name with the owner id and email baked in, so it is only a fallback.
export const fileNameOf = (item) => {
	if (!item) return "file";
	const loc = item.location || {};
	return (
		item.title ||
		(item.resourceId && item.resourceId.title) ||
		loc.filename ||
		(item._id ? `File ${item._id}` : "file")
	);
};

export const guessKind = (url, mime) => {
	const u = (url || "").toLowerCase();
	if (mime) {
		if (mime.indexOf("image") === 0) return "image";
		if (mime.indexOf("video") === 0) return "video";
		if (mime.indexOf("audio") === 0) return "audio";
	}
	if (/\.(png|jpe?g|jfif|gif|webp|avif|svg|bmp)(\?|$)/.test(u)) return "image";
	if (/\.(mp4|m4v|webm|mov|ogv)(\?|$)/.test(u)) return "video";
	if (/\.(mp3|wav|m4a|aac|flac|oga|opus)(\?|$)/.test(u)) return "audio";
	// .ogg can hold either; callers decide which player it gets.
	if (/\.ogg(\?|$)/.test(u)) return "ogg";
	if (/\.pdf(\?|$)/.test(u)) return "pdf";
	return "file";
};

// The API's `format_type` ("image" | "video" | "audio" | "application") is the
// source of truth; the extension guess only covers records without one.
export const kindOf = (item) => {
	const type = item && item.format_type;
	if (type === "image" || type === "video" || type === "audio") return type;
	if (item && String(item.format || "").toLowerCase() === "pdf") return "pdf";
	return guessKind(fileUrlOf(item), item && item.mimetype);
};

export const getExtension = (filename = "") => {
	const dot = filename.lastIndexOf(".");
	return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
};

export const classifyFile = (file) => {
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

/* -------------------------------------------------------------------------- */
/* List helpers                                                               */
/* -------------------------------------------------------------------------- */

export const buildKey = (file, pageHint) =>
	file?._id ||
	file?.location?.public_id ||
	`${file?.location?.filename || "file"}-${pageHint}-${Math.random()
		.toString(36)
		.slice(2)}`;

// Tags every new item with a stable `__key`, skipping ones already listed.
export const keyItems = (rawList, pageHint, seenSet) => {
	const result = [];
	for (const file of Array.isArray(rawList) ? rawList : []) {
		const key = buildKey(file, pageHint);
		if (!seenSet.has(key)) {
			seenSet.add(key);
			result.push({ ...file, __key: key });
		}
	}
	return result;
};

export const seedFromObjects = (objects, pageHint, seenSet) =>
	keyItems(objects?.data, pageHint, seenSet);

export const positiveNumber = (...candidates) => {
	for (const candidate of candidates) {
		const n = Number(candidate);
		if (Number.isFinite(n) && n > 0) return n;
	}
	return null;
};

/* -------------------------------------------------------------------------- */
/* Request helpers                                                            */
/* -------------------------------------------------------------------------- */

// fetchurl can reject (network drop, abort) or resolve to nothing; turn both
// into the API's own error shape so every caller has a single path to check.
export const safeFetch = async (...args) => {
	try {
		const res = await fetchurl(...args);
		return res || { status: "error", message: "No response from the server" };
	} catch (err) {
		return { status: "error", message: err?.message || "Network error" };
	}
};

// fetchurl resolves with the caught error instead of rejecting, so an Error
// instance (or `success: false`) has to count as a failure too.
export const isFailure = (res) =>
	!res ||
	res instanceof Error ||
	res.status === "error" ||
	res.status === "fail" ||
	res.success === false;

// The API answers an empty list (or a page past the end) with a "fail", which
// must be shown as "no files" rather than as an error.
export const isEmptyPage = (res) =>
	res?.status === "fail" && /does not exist/i.test(res?.message || "");

/* -------------------------------------------------------------------------- */
/* Upload helpers                                                             */
/* -------------------------------------------------------------------------- */

export const generateId = () => Math.random().toString(36).slice(2, 9);

// `fallback` is what an unrecognised type becomes in this manager.
export const getFileType = (mimeType = "", fallback = "video") => {
	if (mimeType.startsWith("image/")) return "image";
	if (mimeType.startsWith("audio/")) return "audio";
	if (mimeType.startsWith("video/")) return "video";
	return fallback;
};

// Mirrors an <input accept="audio/*,video/*"> value, so the input attribute
// and the JS check can never drift apart.
export const matchesAccept = (file, accept) => {
	const type = file?.type || "";
	return String(accept)
		.split(",")
		.map((token) => token.trim())
		.filter(Boolean)
		.some((token) =>
			token.endsWith("/*")
				? type.startsWith(token.slice(0, -1))
				: type === token,
		);
};

export const getMediaIcon = (type) => {
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

// The admin forms receive `{ data: user }`, while the comment editor receives
// a flat user; read both so the uploader never gets "undefined".
export const uploaderFields = (auth = {}) => ({
	userId: auth?.data?._id ?? auth?.userId,
	username: auth?.data?.username ?? auth?.username,
	userEmail: auth?.data?.email ?? auth?.email,
});

// Resolves `{ file, ...extra }`, where `extra` comes from `afterUpload` (used
// to create the record that owns the stored file).
export const uploadFileToServer = ({
	blob,
	filename,
	token = {},
	fields = {},
	onProgress,
	onUploaded,
	afterUpload,
}) => {
	const xhr = new XMLHttpRequest();
	const res = new Promise((resolve, reject) => {
		const formData = new FormData();
		for (const [key, value] of Object.entries(fields)) {
			if (value !== undefined && value !== null) formData.append(key, value);
		}
		formData.append("file", blob, filename);

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable && onProgress) {
				onProgress(Math.round((event.loaded * 100) / event.total));
			}
		});

		xhr.upload.addEventListener("load", () => {
			if (onProgress) onProgress(100);
			if (onUploaded) onUploaded();
		});

		xhr.addEventListener("load", () => {
			if (xhr.status < 200 || xhr.status >= 300) {
				reject(
					new Error(
						`Upload failed with status ${xhr.status}: ${xhr.statusText}`,
					),
				);
				return;
			}
			// A throw inside this listener would never reach the Promise, leaving
			// the caller stuck on "Uploading..." forever, so parse defensively.
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
			Promise.resolve(afterUpload ? afterUpload(parsed) : null)
				.then((extra) => resolve({ file: parsed, ...(extra || {}) }))
				.catch(reject);
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

// Builds the list entry for a freshly uploaded file that a record (song,
// video...) points at under `files[fileField]`.
export const buildUploadedRecordEntry = ({
	uploaded,
	record,
	fileObj,
	fileField,
	extra = {},
}) => {
	const serverObj = uploaded?.data || uploaded || {};
	const loc = serverObj.location || {};
	const recordData = record?.data || {};
	const rawFormat =
		typeof serverObj.format_type === "string"
			? serverObj.format_type.toLowerCase()
			: "";
	return {
		// The record's id, not the file's: row actions call /noadmin/<type>/:id.
		_id: recordData._id,
		status: recordData.status || "draft",
		title: recordData.title || serverObj.title || fileObj.name,
		createdAt: serverObj.createdAt || new Date().toISOString(),
		files: {
			[fileField]: {
				_id: serverObj._id,
				format_type: ["audio", "video", "image"].includes(rawFormat)
					? rawFormat
					: fileObj.type,
				size:
					typeof serverObj.size === "number" ? serverObj.size : fileObj.size,
				location: {
					filename: loc.filename || fileObj.name,
					secure_location: loc.secure_location || fileObj.url,
					public_id: loc.public_id,
				},
			},
		},
		album: serverObj.album,
		...extra,
	};
};

export const recordingExtension = (mimeType, kind) => {
	if (mimeType.includes("mp4")) return kind === "video" ? "mp4" : "m4a";
	if (mimeType.includes("ogg")) return "ogg";
	return "webm";
};

/* -------------------------------------------------------------------------- */
/* Form helpers                                                               */
/* -------------------------------------------------------------------------- */

// The hidden `text_hashtags` field is JSON; a malformed value must not throw
// mid-submit and leave the form locked.
export const readJsonList = (formData, name) => {
	try {
		const parsed = JSON.parse(formData.get(name) || "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

// Keeps the stored tags when the body is untouched and no new ones were found.
export const resolveTags = (formData, previous = {}) => {
	const tags = readJsonList(formData, "text_hashtags");
	const bodyUnchanged = (formData.get("text") || "") === (previous.text || "");
	return bodyUnchanged && !tags.length ? previous.tags || [] : tags;
};

export const scheduledAtFrom = (formData) => {
	const local = formData.get("scheduledAt");
	if (formData.get("status") !== "scheduled" || !local) return null;
	const date = new Date(local);
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const boolString = (value, fallback = true) => String(value ?? fallback);
