"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import Webcam from "react-webcam";
import UseProgress from "@/components/global/useprogress";
import { getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import {
	isFailure,
	safeFetch,
	uploadFileToServer,
	uploaderFields,
} from "@/helpers/filemanagerhelpers";
import PictureEditor, {
	loadPictureImage,
	normalizePictureEdit,
	preparePictureFile,
	renderPicture,
} from "@/components/auth/pictureeditor";

const AVATAR_SIZE = 800;

const videoConstraints = {
	facingMode: "user",
	width: { ideal: 1920 },
	height: { ideal: 1080 },
};

const CAMERA_ERRORS = {
	NotAllowedError:
		"Camera access is blocked. Allow it in your browser's site settings, then try again.",
	NotFoundError: "No camera was found on this device.",
	NotReadableError:
		"Your camera is busy in another app. Close that app, then try again.",
};

const cameraErrorMessage = (err) =>
	CAMERA_ERRORS[err?.name] ||
	(typeof err === "string"
		? "This browser can't open a camera on this page."
		: "Your camera could not be started. Please try again.");

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

const UploadPictureForm = ({ auth = {} }) => {
	const router = useRouter();
	const titleId = useId();
	const fileurl =
		auth?.data?.files?.avatar?.location?.secure_location ||
		`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`;
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [cameraModal, setCameraModal] = useState(false);
	const [cameraReady, setCameraReady] = useState(false);
	const [cameraError, setCameraError] = useState("");
	const [capture, setCapture] = useState(null);
	const [edit, setEdit] = useState(normalizePictureEdit);
	const [editorStatus, setEditorStatus] = useState("loading");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [btnText, setBtnText] = useState("Submit");
	const [error, setError] = useState("");

	const webcamRef = useRef(null);
	const shotRef = useRef(0);

	useEffect(() => {
		if (!capture) return;
		const { url } = capture;
		return () => URL.revokeObjectURL(url);
	}, [capture]);

	useEffect(
		() => () => {
			shotRef.current += 1;
		},
		[],
	);

	const startCamera = () => {
		setCameraReady(false);
		setCameraError("");
	};

	const resetForm = () => {
		setCapture(null);
		setEdit(normalizePictureEdit());
		setUploadPercentage(0);
		setError("");
	};

	const openCamera = () => {
		resetForm();
		startCamera();
		setCameraModal(true);
	};

	const closeCamera = () => {
		if (isSubmitting) return;
		shotRef.current += 1;
		setCameraModal(false);
	};

	const takePhoto = async () => {
		const canvas = webcamRef.current?.getCanvas();
		if (!canvas) {
			setError("The camera is still starting. Please try again in a moment.");
			return;
		}
		const shot = ++shotRef.current;
		const blob = await new Promise((resolve) =>
			canvas.toBlob(resolve, "image/jpeg", 0.92),
		);
		if (shot !== shotRef.current) return;
		if (!blob) {
			setError("The photo could not be taken. Please try again.");
			return;
		}
		const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
		setError("");
		setEdit(normalizePictureEdit());
		setEditorStatus("loading");
		setCapture({ url: URL.createObjectURL(file), file });
	};

	const retakePhoto = () => {
		setCapture(null);
		setUploadPercentage(0);
		setError("");
		startCamera();
	};

	const upgradeAvatar = async (e) => {
		e.preventDefault();
		if (!capture || editorStatus !== "ready" || isSubmitting) return;
		setIsSubmitting(true);
		setError("");
		setUploadPercentage(0);
		let picture;
		try {
			setBtnText("Preparing...");
			picture = await loadPictureImage(capture.url);
			const settings = normalizePictureEdit(edit);
			const avatar = await renderPicture(picture.image, settings, {
				width: AVATAR_SIZE,
				height: AVATAR_SIZE,
				name: "avatar",
			});
			const original = await preparePictureFile(capture.file, picture.image);

			setBtnText("Uploading...");
			const token = await getAuthTokenOnServer();
			const [storedOriginal, storedAvatar] = await uploadInOrder(
				[
					{ ...original, album: "all" },
					{ ...avatar, album: "profile-avatars" },
				],
				token,
				{ ...uploaderFields(auth), onModel: "User" },
				setUploadPercentage,
			);

			setBtnText("Saving...");
			const res = await safeFetch(`/auth/updateavatar`, "PUT", "no-cache", {
				avatar: storedAvatar._id,
				edit: { ...settings, original: storedOriginal._id },
			});
			if (isFailure(res)) {
				throw new Error(
					res?.message || res?.error || "Your avatar could not be saved",
				);
			}

			toast.success("Avatar uploaded");
			setCameraModal(false);
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

	return (
		<>
			<div className="card-body">
				<div className="align-content-center d-flex justify-content-center mb-3">
					<Image
						src={fileurl}
						alt="Your current avatar"
						width="150"
						height="150"
						style={{
							width: "150px",
							height: "150px",
							objectFit: "cover",
						}}
						priority={true}
						className="img-thumbnail rounded-circle"
					/>
				</div>
				<button
					className="btn btn-secondary btn-sm w-100"
					type="button"
					onClick={openCamera}
				>
					<i aria-hidden className="fa-solid fa-camera me-1 align-middle" />
					Open camera
				</button>
			</div>
			<Modal
				show={cameraModal}
				onHide={closeCamera}
				onExited={resetForm}
				size="xl"
				backdrop={false}
				animation={true}
				aria-labelledby={titleId}
			>
				<form onSubmit={upgradeAvatar} aria-busy={isSubmitting}>
					<Modal.Header>
						<Modal.Title id={titleId}>
							{capture ? "Adjust your photo" : "Smile!"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{capture ? (
							<PictureEditor
								src={capture.url}
								alt="Your new avatar"
								label="Avatar"
								shape="circle"
								aspectRatio={1}
								maxWidth={320}
								value={edit}
								onChange={setEdit}
								onStatusChange={setEditorStatus}
								disabled={isSubmitting}
							/>
						) : cameraError ? (
							<div
								className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0"
								role="alert"
							>
								<span>{cameraError}</span>
								<button
									type="button"
									className="btn btn-outline-danger btn-sm"
									onClick={startCamera}
								>
									Try again
								</button>
							</div>
						) : cameraModal ? (
							<div
								className="position-relative overflow-hidden rounded bg-dark"
								style={cameraReady ? undefined : { aspectRatio: "16 / 9" }}
							>
								<Webcam
									audio={false}
									forceScreenshotSourceSize={true}
									imageSmoothing={true}
									mirrored={false}
									onLoadedData={() => setCameraReady(true)}
									onUserMediaError={(err) =>
										setCameraError(cameraErrorMessage(err))
									}
									videoConstraints={videoConstraints}
									className="d-block"
									style={{ maxWidth: "100%", width: "100%" }}
									ref={webcamRef}
								/>
								{cameraReady ? null : (
									<div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-light">
										<span className="spinner-border" role="status">
											<span className="visually-hidden">
												Starting the camera
											</span>
										</span>
									</div>
								)}
							</div>
						) : null}
						{error ? (
							<div className="alert alert-danger py-2 mt-3 mb-0" role="alert">
								{error}
							</div>
						) : null}
						<hr />
						<UseProgress percentage={uploadPercentage} />
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-secondary btn-sm"
							type="button"
							onClick={closeCamera}
							disabled={isSubmitting}
						>
							Close
						</button>
						{capture ? (
							<>
								<button
									className="btn btn-secondary btn-sm"
									type="button"
									onClick={retakePhoto}
									disabled={isSubmitting}
								>
									<i
										aria-hidden
										className="fa-solid fa-rotate-left me-1 align-middle"
									/>
									Retake
								</button>
								<button
									className="btn btn-primary btn-sm"
									type="submit"
									disabled={isSubmitting || editorStatus !== "ready"}
								>
									{btnText}
								</button>
							</>
						) : (
							<button
								className="btn btn-primary btn-sm"
								type="button"
								onClick={takePhoto}
								disabled={!cameraReady || Boolean(cameraError)}
							>
								<i
									aria-hidden
									className="fa-solid fa-camera me-1 align-middle"
								/>
								Take photo
							</button>
						)}
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
};

export default UploadPictureForm;
