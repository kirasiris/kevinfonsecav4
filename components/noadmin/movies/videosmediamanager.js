"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { formatFileSize } from "@/helpers/formatFileSize";
import Single from "./videosingle";
import {
	useInfiniteList,
	useListActions,
	useListSearch,
	useMediaElements,
	useObjectUrls,
} from "@/components/global/filemanagerui";
import {
	classifyFile,
	generateId,
	getFileType,
	getMediaIcon,
	isFailure,
	matchesAccept,
	safeFetch,
	uploadFileToServer,
	uploaderFields,
} from "@/helpers/filemanagerhelpers";

/* -------------------------------------------------------------------------- */
/* Upload helpers                                                             */
/* -------------------------------------------------------------------------- */

const ACCEPTED_FILE_TYPES = "video/*";

const isAcceptedFile = (file) => matchesAccept(file, ACCEPTED_FILE_TYPES);

// The file is already stored when this runs; failing here reports the error
// instead of listing an entry that has no record behind it.
const createVideoRecord = async (parsed, object) => {
	const record = await safeFetch(
		`/noadmin/videos`,
		"POST",
		"no-cache",
		{
			resourceId: object?._id,
			duration: "0:0",
			status: "draft",
			averageRating: 10,
			onModel: "Playlist",
			title: parsed?.data?.title,
			text: "No description",
			language: "english",
			files: {
				video_url: parsed?.data?._id,
			},
			embedding: false,
			commented: false,
		},
		undefined,
		false,
		false,
	);
	if (isFailure(record)) {
		throw new Error(
			record?.message || "File uploaded, but its record could not be created",
		);
	}
	return { record };
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const VideosMediaManager = ({
	auth = {},
	token = {},
	object = {},
	objects = [],
	searchParams = {},
}) => {
	/* ------------------------------ Paging setup ---------------------------- */

	const {
		seenKeysRef,
		sentinelRef,
		newobjects,
		setNewObjects,
		countAll,
		setCountAll,
		hasMore,
		loading,
		error,
		handleRetry,
		insertItem,
		clearList,
	} = useInfiniteList({
		objects,
		searchParams,
		endpoint: "/global/videos",
		query: `resourceId=${object?._id}`,
		defaultSort: "orderingNumber",
		failMessage: "Failed to retrieve videos",
	});

	/* ------------------------------- List state ----------------------------- */

	const isMountedRef = useRef(false);
	/* ------------------------------ Upload state ---------------------------- */

	const [files, setFiles] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [showCamera, setShowCamera] = useState(false);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [pendingMediaType, setPendingMediaType] = useState(null);
	const [permissions, setPermissions] = useState({ video: false });

	const fileInputRef = useRef(null);
	const videoPreviewRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const chunksRef = useRef([]);
	const uploadsRef = useRef([]);
	const uploadXhrsRef = useRef(new Map());
	const startingMediaRef = useRef(false);

	const pendingUploads = files.filter((f) => !f.uploadError);
	const hasStoredVideo = newobjects.length > 0;
	const uploadBlockedMessage = hasStoredVideo
		? "Only one video is allowed. Permanently delete the stored video before uploading a new one."
		: pendingUploads.length > 0
			? "A video is already being uploaded. Wait for it to finish, or remove it, before adding another."
			: "";
	// Kept in a ref so callbacks created earlier (e.g. MediaRecorder.onstop)
	// still check the latest state rather than the one from their render.
	const uploadBlockedRef = useRef(uploadBlockedMessage);
	uploadBlockedRef.current = uploadBlockedMessage;

	/* -------------------------------- Lifecycle ----------------------------- */

	useEffect(() => {
		uploadsRef.current = files;
	}, [files]);

	useEffect(() => {
		// Strict Mode runs this cleanup on its fake unmount, so the flag has to
		// be set back to true on every setup.
		isMountedRef.current = true;
		const recorder = mediaRecorderRef;
		const stream = streamRef;
		const xhrs = uploadXhrsRef;
		return () => {
			isMountedRef.current = false;
			// Detach first: stopping a live recorder fires onstop, which would
			// otherwise start a new upload after the component is gone.
			const rec = recorder.current;
			if (rec) {
				rec.ondataavailable = null;
				rec.onstop = null;
				if (rec.state !== "inactive") rec.stop();
			}
			recorder.current = null;
			stream.current?.getTracks().forEach((track) => track.stop());
			stream.current = null;
			xhrs.current.forEach((xhr) => xhr.abort());
			xhrs.current.clear();
		};
	}, []);

	/* ------------------------------- Object URLs ---------------------------- */

	const { createObjectUrl, revokeObjectUrl, keepObjectUrl } = useObjectUrls();

	/* ------------------------------- Row actions ---------------------------- */

	const {
		isBusy,
		handleDraftIt,
		handlePublishIt,
		handleTrashIt,
		handleScheduleIt,
		handleDeleteIt,
		trashingAll,
		deletingAll,
		handleTrashAll,
		handleDeleteAll,
	} = useListActions({
		list: { setNewObjects, seenKeysRef, setCountAll, clearList },
		endpoint: "/noadmin/videos",
		noun: "video",
		bulkBody: { onModel: "Playlist", resourceId: object?._id },
	});

	/* ------------------------------- Derived list --------------------------- */

	const items = useMemo(
		() =>
			newobjects.map((file) => ({
				key: file.__key,
				raw: file,
				filename: file?.files?.video_url?.location?.filename || "unknown",
				url: file?.files?.video_url?.location?.secure_location || "",
				size: file?.files?.video_url?.size,
				info: classifyFile(file?.files?.video_url),
			})),
		[newobjects],
	);

	/* ------------------------------ Media elements -------------------------- */

	const { pauseAllMedia, registerMediaElement, forgetMediaElement } =
		useMediaElements();

	/* -------------------------------- Uploading ----------------------------- */

	const ensureCanUpload = () => {
		if (uploadBlockedRef.current) {
			toast.error(uploadBlockedRef.current);
			return false;
		}
		return true;
	};

	const addAndUploadFile = useCallback(
		(fileObj) => {
			if (!isMountedRef.current) {
				revokeObjectUrl(fileObj.url);
				return;
			}
			if (uploadBlockedRef.current) {
				revokeObjectUrl(fileObj.url);
				toast.error(uploadBlockedRef.current);
				return;
			}
			// Block synchronously so a second call in the same tick is rejected.
			uploadBlockedRef.current =
				"A video is already being uploaded. Wait for it to finish, or remove it, before adding another.";

			// A failed attempt is replaced by the new one, so only one card remains.
			uploadsRef.current.forEach((f) => {
				forgetMediaElement(f.id);
				revokeObjectUrl(f.url);
			});
			setFiles([
				{ ...fileObj, uploading: true, progress: 0, uploadError: null },
			]);

			const { res, xhr } = uploadFileToServer({
				blob: fileObj.blob,
				filename: fileObj.name,
				token,
				fields: {
					...uploaderFields(auth),
					onModel: "Playlist",
					resourceId: object?._id,
					album: "tv-shows",
				},
				onProgress: (progress) => {
					if (!isMountedRef.current) return;
					setFiles((prev) =>
						prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)),
					);
				},
				afterUpload: (parsed) => createVideoRecord(parsed, object),
			});

			uploadXhrsRef.current.set(fileObj.id, xhr);

			res
				.then(({ file: uploaded, record }) => {
					if (!isMountedRef.current) {
						return;
					}
					const serverObj = uploaded?.data || uploaded || {};
					const loc = serverObj.location || {};
					const recordData = record?.data || {};
					// With no remote URL the list keeps showing the local preview, so
					// that URL has to outlive the tray card.
					if (loc.secure_location) {
						revokeObjectUrl(fileObj.url);
					} else {
						keepObjectUrl(fileObj.url);
					}
					forgetMediaElement(fileObj.id);
					setFiles((prev) => prev.filter((f) => f.id !== fileObj.id));

					const rawFormat =
						typeof serverObj.format_type === "string"
							? serverObj.format_type.toLowerCase()
							: "";
					const normalizedType = ["audio", "video", "image"].includes(rawFormat)
						? rawFormat
						: fileObj.type;

					insertItem({
						// The record's id, not the file's: the row actions call
						// /noadmin/videos/:id, which expects the record.
						_id: recordData._id,
						status: recordData.status || "draft",
						title: recordData.title || serverObj.title || fileObj.name,
						createdAt: serverObj.createdAt || new Date().toISOString(),
						files: {
							video_url: {
								_id: serverObj._id,
								format_type: normalizedType,
								size:
									typeof serverObj.size === "number"
										? serverObj.size
										: fileObj.size,
								location: {
									filename: loc.filename || fileObj.name,
									secure_location: loc.secure_location || fileObj.url,
									public_id: loc.public_id,
								},
							},
						},
						language: "english",
						album: serverObj.album,
					});
				})
				.catch((err) => {
					if (err?.name === "AbortError" || !isMountedRef.current) {
						return;
					}
					setFiles((prev) =>
						prev.map((f) =>
							f.id === fileObj.id
								? {
										...f,
										uploading: false,
										uploadError: err?.message || "Upload failed",
									}
								: f,
						),
					);
				})
				.finally(() => {
					uploadXhrsRef.current.delete(fileObj.id);
				});
		},
		[
			insertItem,
			revokeObjectUrl,
			keepObjectUrl,
			forgetMediaElement,
			auth,
			token,
			object,
		],
	);

	const handleFileUpload = (e) => {
		// Copied before the input is reset, which empties its FileList.
		const selected = Array.from(e.target.files || []);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		const file = selected[0];
		if (!file || !ensureCanUpload()) {
			return;
		}
		if (!isAcceptedFile(file)) {
			toast.error("Only video files can be uploaded here.");
			return;
		}
		if (selected.length > 1) {
			toast.info(
				"Only one video can be uploaded. Using the first one selected.",
			);
		}
		// A File already is a Blob, so it is uploaded as-is.
		addAndUploadFile({
			id: generateId(),
			blob: file,
			url: createObjectUrl(file),
			name: file.name,
			type: getFileType(file.type),
			size: file.size,
		});
	};

	const openFilePicker = () => {
		if (!ensureCanUpload()) {
			return;
		}
		fileInputRef.current?.click();
	};

	const removeFile = (id) => {
		const xhr = uploadXhrsRef.current.get(id);
		if (xhr) {
			xhr.abort();
			uploadXhrsRef.current.delete(id);
		}
		forgetMediaElement(id);
		// Revoked outside the state updater: updaters must stay pure (Strict Mode
		// runs them twice).
		const fileToRemove = uploadsRef.current.find((f) => f.id === id);
		if (fileToRemove) {
			revokeObjectUrl(fileToRemove.url);
		}
		setFiles((prev) => prev.filter((f) => f.id !== id));
	};

	/* ------------------------------- Permissions ---------------------------- */

	const grantAndStart = async (type) => {
		const ok = await startMediaStream(type);
		if (ok) {
			setPermissions((prev) => ({ ...prev, [type]: true }));
		}
		return ok;
	};

	const requestPermission = async (type) => {
		if (!ensureCanUpload()) {
			return;
		}
		// Skip the modal if permission was already granted this session.
		if (permissions[type]) {
			startMediaStream(type);
			return;
		}
		// The in-memory flag resets on remount, but the browser persists the
		// grant. Query the Permissions API so an approved user isn't re-prompted.
		try {
			if (navigator.permissions?.query) {
				const states = await Promise.all(
					["camera", "microphone"].map((name) =>
						navigator.permissions
							.query({ name })
							.then((status) => status.state)
							.catch(() => "prompt"),
					),
				);
				if (states.every((state) => state === "granted")) {
					await grantAndStart(type);
					return;
				}
			}
		} catch {
			// Permissions API unsupported for these names — fall back to the modal.
		}
		if (!isMountedRef.current) {
			return;
		}
		setPendingMediaType(type);
		setShowPermissionModal(true);
	};

	const handlePermissionGranted = async () => {
		const type = pendingMediaType;
		setShowPermissionModal(false);
		setPendingMediaType(null);
		if (!type) {
			return;
		}
		await grantAndStart(type);
	};

	const handlePermissionDenied = () => {
		setShowPermissionModal(false);
		setPendingMediaType(null);
	};

	/* --------------------------------- Capture ------------------------------ */

	const startMediaStream = async (type) => {
		// Two quick clicks would otherwise open two streams, and the first one
		// would keep the camera light on with nothing left to stop it.
		if (startingMediaRef.current || streamRef.current) {
			return false;
		}
		startingMediaRef.current = true;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			// The user may have left the page while the browser prompt was open.
			if (!isMountedRef.current) {
				stream.getTracks().forEach((track) => track.stop());
				return false;
			}
			streamRef.current = stream;
			setShowCamera(true);
			return true;
		} catch (err) {
			console.error("Error accessing media devices:", err);
			toast.error(
				"Could not access the camera. Please check your browser permission settings.",
			);
			setPermissions((prev) => ({ ...prev, [type]: false }));
			return false;
		} finally {
			startingMediaRef.current = false;
		}
	};

	useEffect(() => {
		const preview = videoPreviewRef.current;
		if (showCamera && streamRef.current && preview) {
			preview.srcObject = streamRef.current;
		}
		return () => {
			if (preview) preview.srcObject = null;
		};
	}, [showCamera]);

	const startRecording = () => {
		if (!streamRef.current || mediaRecorderRef.current || !ensureCanUpload()) {
			return;
		}
		let mediaRecorder;
		try {
			mediaRecorder = new MediaRecorder(streamRef.current);
		} catch (err) {
			console.error("Could not start MediaRecorder:", err);
			toast.error("Recording is not supported in this browser.");
			return;
		}
		// Captured per recording, so a late onstop can't mix up chunks.
		const chunks = [];
		chunksRef.current = chunks;
		mediaRecorderRef.current = mediaRecorder;

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunks.push(e.data);
		};

		mediaRecorder.onstop = () => {
			if (mediaRecorderRef.current === mediaRecorder) {
				mediaRecorderRef.current = null;
			}
			chunksRef.current = [];
			if (!isMountedRef.current) {
				return;
			}
			setIsRecording(false);
			// Use the format the browser actually produced (Safari records mp4).
			const mimeType = mediaRecorder.mimeType || "video/webm";
			const blob = new Blob(chunks, { type: mimeType });
			chunks.length = 0;
			if (blob.size === 0) {
				return;
			}
			const ext = mimeType.includes("mp4") ? "mp4" : "webm";
			addAndUploadFile({
				id: generateId(),
				blob,
				url: createObjectUrl(blob),
				name: `video_${Date.now()}.${ext}`,
				type: "video",
				size: blob.size,
			});
		};

		mediaRecorder.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		const rec = mediaRecorderRef.current;
		if (rec && rec.state !== "inactive") {
			rec.stop();
		}
		setIsRecording(false);
	};

	const closeMediaStream = () => {
		// Stop the recorder before its tracks so the final chunk is flushed and
		// the recording is still saved.
		stopRecording();
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
		setShowCamera(false);
	};

	/* --------------------------------- Search ------------------------------- */

	const {
		keyword,
		setKeyword,
		debouncedKeyword,
		searchData,
		clearSearch,
		displayedItems,
	} = useListSearch(items);

	/* --------------------------------- Render ------------------------------- */

	const permissionLabel = "camera and microphone";
	const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
	const countBadge = (
		<span className="badge bg-light text-dark">
			{items.length}
			{countAll != null ? ` / ${countAll}` : ""} file
			{items.length !== 1 ? "s" : ""}
		</span>
	);

	return (
		<>
			{/* FILE UPLOADER */}
			<div className="mb-1">
				{showPermissionModal && (
					<div
						className="modal show d-block"
						tabIndex="-1"
						role="dialog"
						aria-modal="true"
						aria-labelledby="permission-modal-title"
						style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="permission-modal-title">
										Permission Required
									</h5>
								</div>
								<div className="modal-body">
									<p>
										This application would like to access your{" "}
										<strong>{permissionLabel}</strong>.
									</p>
									<p className="text-muted mb-0">
										Would you like to grant access?
									</p>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={handlePermissionDenied}
									>
										Deny
									</button>
									<button
										type="button"
										className="btn btn-primary"
										onClick={handlePermissionGranted}
									>
										Allow
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className="card rounded-0 mb-1">
					<div className="card-header">
						<h4 className="mb-0 d-flex align-items-center gap-2">
							<i aria-hidden className="fa-solid fa-upload" />
							Video Manager
						</h4>
					</div>
					<div className="card-body">
						<div className="row g-3 mb-3">
							<div className="col-12 col-md-4">
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileUpload}
									accept={ACCEPTED_FILE_TYPES}
									className="d-none"
									id="fileInput"
								/>
								<button
									type="button"
									className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={openFilePicker}
									aria-disabled={Boolean(uploadBlockedMessage)}
									aria-describedby={
										uploadBlockedMessage ? "upload-blocked-message" : undefined
									}
								>
									<i aria-hidden className="fa-solid fa-upload" />
									Upload Video
								</button>
							</div>

							<div className="col-12 col-md-4">
								<button
									type="button"
									className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => requestPermission("video")}
									disabled={showCamera}
								>
									<i aria-hidden className="fa-solid fa-camera" />
									Open Camera
								</button>
							</div>

							<div className="col-12 col-md-4">
								<div className="bg-light rounded p-2 text-center">
									<small className="text-muted">
										{files.length} file{files.length !== 1 ? "s" : ""} •{" "}
										{formatFileSize(totalSize)}
									</small>
								</div>
							</div>
						</div>

						{uploadBlockedMessage && (
							<div
								id="upload-blocked-message"
								className="alert alert-warning d-flex align-items-center gap-2 rounded-0"
								role="status"
							>
								<i aria-hidden className="fa-solid fa-circle-exclamation" />
								<span>{uploadBlockedMessage}</span>
							</div>
						)}

						{/* Live capture panel */}
						{showCamera && (
							<div className="card mb-3 border-2 border-primary">
								<div className="card-body">
									<div className="text-center mb-3">
										<video
											ref={videoPreviewRef}
											autoPlay
											playsInline
											muted
											className="rounded"
											style={{ maxWidth: "100%", maxHeight: "300px" }}
										/>
									</div>

									<div className="d-flex flex-wrap justify-content-center gap-2">
										{/* {showCamera && (
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={takePhoto}
                                                >
                                                    <i aria-hidden className="fa-solid fa-camera me-1" />
                                                    Take Photo
                                                </button>
                                            )} */}
										{!isRecording ? (
											<button
												type="button"
												className="btn btn-danger btn-sm"
												onClick={startRecording}
											>
												<i
													aria-hidden
													className="fa-solid fa-play align-middle me-1"
												/>
												Start Recording
											</button>
										) : (
											<button
												type="button"
												className="btn btn-dark btn-sm"
												onClick={stopRecording}
											>
												<i
													aria-hidden
													className="fa-solid fa-stop align-middle me-1"
												/>
												Stop Recording
											</button>
										)}
										<button
											type="button"
											className="btn btn-secondary btn-sm"
											onClick={closeMediaStream}
										>
											<i
												aria-hidden
												className="fa-solid fa-xmark align-middle me-1"
											/>
											Close
										</button>
									</div>
								</div>
							</div>
						)}

						{files.length === 0 ? (
							<div className="text-center py-5 rounded admin-multimedia-manager">
								<p className="mb-0">
									No upload in progress. Upload or record a video to get
									started.
								</p>
							</div>
						) : (
							<div className="d-flex flex-nowrap gap-3 overflow-auto pb-3 scroll-thin">
								{files.map((file, index) => (
									<div
										key={file.id}
										className="flex-shrink-0"
										style={{ width: "280px" }}
									>
										<div
											className="card h-100 position-relative"
											style={{ cursor: file.uploading ? "wait" : undefined }}
										>
											<div className="card-header d-flex justify-content-between align-items-center py-2">
												<div className="d-flex align-items-center gap-2">
													<span className="badge bg-secondary">
														{index + 1}
													</span>
													<span
														className={
															file.type === "video"
																? "text-success"
																: "text-info"
														}
													>
														{getMediaIcon(file.type)}
													</span>
												</div>
												{!file.uploading && (
													<button
														type="button"
														className="btn btn-sm btn-outline-danger"
														onClick={() => removeFile(file.id)}
														title="Remove file"
														aria-label={`Remove ${file.name}`}
													>
														<i
															aria-hidden
															className="fa-regular fa-trash-can"
														/>
													</button>
												)}
											</div>
											<div className="card-body p-2 position-relative">
												<div
													style={
														file.uploading
															? { filter: "blur(4px)", pointerEvents: "none" }
															: null
													}
												>
													{file.type === "image" && (
														<img
															src={file.url || "/placeholder.svg"}
															alt={file.name}
															className="img-fluid rounded"
															style={{
																maxHeight: "150px",
																width: "100%",
																objectFit: "fill",
															}}
														/>
													)}
													{file.type === "video" && (
														<video
															ref={(el) => registerMediaElement(file.id, el)}
															src={file.url}
															controls
															preload="metadata"
															className="w-100 rounded"
															style={{
																maxHeight: "150px",
																objectFit: "fill",
															}}
															onPlay={() => pauseAllMedia(file.id)}
														/>
													)}
												</div>
												{file.uploading && (
													<div
														className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
														style={{
															backgroundColor: "rgba(255,255,255,0.55)",
														}}
													>
														<span className="fw-bold fs-3 text-primary">
															{file.progress}%
														</span>
														<small className="text-muted">Uploading...</small>
													</div>
												)}
											</div>
											<div className="card-footer py-2">
												<p
													className="mb-1 text-truncate small fw-medium"
													title={file.name}
												>
													{file.name}
												</p>
												<div className="d-flex justify-content-between align-items-center">
													<small>{formatFileSize(file.size)}</small>
													{file.uploadError && (
														<small
															className="text-danger"
															title={file.uploadError}
														>
															Upload failed
														</small>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						<div className="mt-4 p-3 rounded admin-multimedia-manager">
							<h6 className="fw-bold mb-2">Instructions</h6>
							<ul className="mb-0 small">
								<li>Only one video can be stored at a time</li>
								<li>
									To replace it, permanently delete the stored video first
									(trashing it is not enough)
								</li>
								<li>Upload a video file using the upload button</li>
								<li>Use the camera to record one instead</li>
								<li>Click the trash icon to cancel an upload</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* GET API ENDPOINT ERRORS */}
			{error && (
				<div
					className="alert alert-danger d-flex justify-content-between align-items-center"
					role="alert"
				>
					<span>
						<strong>Error:</strong> {error}
					</span>
					<button
						type="button"
						className="btn btn-outline-danger btn-sm"
						onClick={handleRetry}
					>
						Retry
					</button>
				</div>
			)}

			{!error && items.length === 0 && !loading && (
				<div className="alert alert-info rounded-0 mb-0" role="alert">
					No files were returned from the API.
				</div>
			)}

			{items.length > 0 && (
				<div className="card rounded-0 mb-1">
					<div className="card-header">
						<div className="float-start">
							<form
								onSubmit={searchData}
								className="d-none d-md-block"
								role="search"
							>
								<label htmlFor="keyword" className="visually-hidden">
									Search by title
								</label>
								<input
									id="keyword"
									name="keyword"
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									type="search"
									className="form-control"
									placeholder="Search by title"
								/>
							</form>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<button
									type="button"
									className="btn btn-danger btn-sm"
									onClick={handleTrashAll}
									disabled={trashingAll}
								>
									{trashingAll ? "..." : "Trash all"}
								</button>
								<button
									type="button"
									className="btn btn-dark btn-sm"
									onClick={handleDeleteAll}
									disabled={deletingAll}
								>
									{deletingAll ? "..." : "Delete all permanently"}
								</button>
							</div>
						</div>
					</div>
					{/* Dismissed through state: Bootstrap's data-bs-dismiss would remove
              nodes React still owns. */}
					{debouncedKeyword && displayedItems.length === 0 && (
						<div
							className="alert alert-info alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							No objects match &quot;{debouncedKeyword}&quot;.
							<button
								type="button"
								className="btn-close"
								aria-label="Clear search"
								onClick={clearSearch}
							/>
						</div>
					)}
					<ul className="list-group list-group-flush">
						{displayedItems.map((item, index) => (
							<Single
								key={item.key}
								index={index}
								object={item}
								handleDraft={handleDraftIt}
								handlePublish={handlePublishIt}
								handleTrash={handleTrashIt}
								handleSchedule={handleScheduleIt}
								handleDelete={handleDeleteIt}
								isDrafting={isBusy(item.key, "draft")}
								isPublishing={isBusy(item.key, "publish")}
								isTrashing={isBusy(item.key, "trash")}
								isScheduling={isBusy(item.key, "schedule")}
								isDeleting={isBusy(item.key, "delete")}
							/>
						))}
					</ul>
				</div>
			)}

			{/* Sentinel + status row */}
			<div ref={sentinelRef} className="text-center py-4">
				{loading && (
					<div className="d-inline-flex align-items-center gap-2 text-muted">
						<div
							className="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span className="visually-hidden">Loading...</span>
						</div>
						<span>Loading more files...</span>
						<br />
						{!error && countBadge}
					</div>
				)}
				{!loading && !hasMore && items.length > 0 && (
					<>
						<small className="text-muted">No more files to load.</small>
						<br />
						{!error && countBadge}
					</>
				)}
			</div>
		</>
	);
};

export default VideosMediaManager;
