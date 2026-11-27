"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import {
	isFailure,
	safeFetch,
	uploadFileToServer,
	uploaderFields,
} from "@/helpers/filemanagerhelpers";
import UseProgress from "@/components/global/useprogress";
import PictureEditor, {
	isSamePictureEdit,
	loadPictureImage,
	normalizePictureEdit,
	preparePictureFile,
	readPictureFile,
	renderPicture,
} from "@/components/auth/pictureeditor";

const AVATAR_SIZE = 800;
const MIN_AVATAR_SIZE = 180;

const savedAvatarOf = (auth) => {
	const edit = auth?.data?.pictureEdits?.avatar;
	if (edit?.original?.location?.secure_location) {
		return {
			url: edit.original.location.secure_location,
			originalId: edit.original._id,
			edit: normalizePictureEdit(edit),
			isEdited: true,
		};
	}
	const avatar = auth?.data?.files?.avatar;
	return {
		url: avatar?.location?.secure_location || "",
		originalId: avatar?._id || null,
		edit: normalizePictureEdit(),
		isEdited: false,
	};
};

const uploadInOrder = async (items, token, fields, onProgress) => {
	const totalBytes = items.reduce((sum, item) => sum + item.blob.size, 0) || 1;
	const stored = [];
	let sentBytes = 0;
	for (const item of items) {
		const { res } = uploadFileToServer({
			blob: item.blob,
			filename: item.filename,
			token,
			fields: { ...fields, album: item.album },
			onProgress: (percent) =>
				onProgress(
					Math.round(
						((sentBytes + (item.blob.size * percent) / 100) * 100) / totalBytes,
					),
				),
		});
		const { file } = await res;
		if (!file?.data?._id) {
			throw new Error("The upload finished but no file came back");
		}
		stored.push(file.data);
		sentBytes += item.blob.size;
	}
	return stored;
};

const UpdateAvatarForm = ({ auth = {} }) => {
	const router = useRouter();
	const saved = useMemo(() => savedAvatarOf(auth), [auth]);

	const [source, setSource] = useState(() => ({
		url: saved.url,
		originalId: saved.originalId,
		file: null,
	}));
	const [edit, setEdit] = useState(saved.edit);
	const [editorStatus, setEditorStatus] = useState("loading");
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [btnText, setBtnText] = useState("Submit");
	const [error, setError] = useState("");

	const fileInputRef = useRef(null);
	const selectionRef = useRef(0);

	useEffect(() => {
		if (!source.url.startsWith("blob:")) return;
		const url = source.url;
		return () => URL.revokeObjectURL(url);
	}, [source.url]);

	useEffect(
		() => () => {
			selectionRef.current += 1;
		},
		[],
	);

	const hasChanges =
		Boolean(source.file) ||
		source.originalId !== saved.originalId ||
		!isSamePictureEdit(edit, saved.edit);
	const canSave =
		editorStatus === "ready" &&
		!isSubmitting &&
		(hasChanges || !saved.isEdited);

	const handleFileChange = async (e) => {
		const input = e.currentTarget;
		const file = input.files?.[0];
		if (!file) return;
		const selection = ++selectionRef.current;
		setError("");
		try {
			const picture = await readPictureFile(file, {
				minWidth: MIN_AVATAR_SIZE,
				minHeight: MIN_AVATAR_SIZE,
			});
			if (selection !== selectionRef.current) {
				URL.revokeObjectURL(picture.url);
				return;
			}
			setSource({ url: picture.url, originalId: null, file });
			setEdit(normalizePictureEdit());
		} catch (err) {
			if (selection !== selectionRef.current) return;
			input.value = "";
			setError(err.message);
		}
	};

	const upgradeAvatar = async (e) => {
		e.preventDefault();
		if (!canSave) return;
		selectionRef.current += 1;
		setIsSubmitting(true);
		setError("");
		setUploadPercentage(0);
		let picture;
		try {
			setBtnText("Preparing...");
			picture = await loadPictureImage(source.url);
			const settings = normalizePictureEdit(edit);
			const avatar = await renderPicture(picture.image, settings, {
				width: AVATAR_SIZE,
				height: AVATAR_SIZE,
				name: "avatar",
			});
			const original = source.file
				? await preparePictureFile(source.file, picture.image)
				: null;

			setBtnText("Uploading...");
			const token = await getAuthTokenOnServer();
			const stored = await uploadInOrder(
				[
					...(original ? [{ ...original, album: "all" }] : []),
					{ ...avatar, album: "profile-avatars" },
				],
				token,
				{ ...uploaderFields(auth), onModel: "User" },
				setUploadPercentage,
			);
			const originalId = original ? stored[0]._id : source.originalId;

			setBtnText("Saving...");
			const res = await safeFetch(`/auth/updateavatar`, "PUT", "no-cache", {
				avatar: stored.at(-1)._id,
				edit: { ...settings, original: originalId },
			});
			if (isFailure(res)) {
				throw new Error(
					res?.message || res?.error || "Your avatar could not be saved",
				);
			}

			setSource((current) => ({ ...current, originalId, file: null }));
			if (fileInputRef.current) fileInputRef.current.value = "";
			toast.success("Avatar updated");
			router.refresh();
		} catch (err) {
			const message = err?.message || "Something went wrong during upload";
			setError(message);
			toast.error(message);
		} finally {
			picture?.release();
			setIsSubmitting(false);
			setBtnText("Submit");
		}
	};

	const resetForm = () => {
		selectionRef.current += 1;
		setSource({ url: saved.url, originalId: saved.originalId, file: null });
		setEdit(saved.edit);
		setError("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="card-body">
			<form onSubmit={upgradeAvatar} aria-busy={isSubmitting}>
				<PictureEditor
					src={source.url}
					alt={`${auth?.data?.username || "Your"} avatar`}
					label="Avatar"
					shape="circle"
					aspectRatio={1}
					maxWidth={320}
					value={edit}
					onChange={setEdit}
					onStatusChange={setEditorStatus}
					disabled={isSubmitting}
				/>
				<label htmlFor="avatar" className="form-label">
					Choose a new picture
				</label>
				<input
					ref={fileInputRef}
					id="avatar"
					name="file"
					type="file"
					accept="image/*"
					className="form-control mb-1"
					onChange={handleFileChange}
					disabled={isSubmitting}
					aria-describedby="avatar-help"
				/>
				<div id="avatar-help" className="form-text mb-3">
					JPG, PNG, WebP or GIF of at least {MIN_AVATAR_SIZE} ×{" "}
					{MIN_AVATAR_SIZE} px. Big photos are resized before uploading.
				</div>
				{error ? (
					<div className="alert alert-danger py-2" role="alert">
						{error}
					</div>
				) : null}
				<UseProgress percentage={uploadPercentage} />
				<div className="d-flex justify-content-between">
					<button
						type="submit"
						className="btn btn-secondary btn-sm"
						disabled={!canSave}
					>
						{btnText}
					</button>
					<button
						type="button"
						className="btn btn-secondary btn-sm"
						onClick={resetForm}
						disabled={isSubmitting}
					>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
};

export default UpdateAvatarForm;
