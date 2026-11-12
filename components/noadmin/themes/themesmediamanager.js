"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { formatFileSize } from "@/helpers/formatFileSize";
import Single from "@/components/noadmin/files/single";
import {
	useInfiniteList,
	useListSearch,
	useMediaElements,
	useObjectUrls,
	useUploadReorder,
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

const ACCEPTED_FILE_TYPES = "image/*,video/*";

const isAcceptedFile = (file) => matchesAccept(file, ACCEPTED_FILE_TYPES);

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const ThemesMediaManager = ({
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
	} = useInfiniteList({
		objects,
		searchParams,
		endpoint: "/global/files",
		query: `resourceId=${object?._id}`,
		defaultSort: "-createdAt",
		failMessage: "Failed to retrieve files",
	});

	/* ------------------------------- List state ----------------------------- */

	const isMountedRef = useRef(false);
	// The ref (not state) blocks a double click before the re-render lands.
	const deletingKeysRef = useRef(new Set());

	// A Set, so deleting two files at once doesn't re-enable the first button
	// when the second request finishes.
	const [deletingKeys, setDeletingKeys] = useState(() => new Set());

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
	const attachQueueRef = useRef(Promise.resolve());

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

	const setDeleting = (key, isDeleting) => {
		if (isDeleting) deletingKeysRef.current.add(key);
		else deletingKeysRef.current.delete(key);
		setDeletingKeys(new Set(deletingKeysRef.current));
	};

	const handleDeleteIt = useCallback(
		async (item) => {
			if (!item?._id || deletingKeysRef.current.has(item.__key)) {
				return;
			}
			setDeleting(item.__key, true);
			const res = await safeFetch(
				`/noadmin/files/${item._id}/permanently`,
				"DELETE",
				"no-cache",
				{},
				undefined,
				false,
				false,
			);
			if (!isMountedRef.current) {
				return;
			}
			if (isFailure(res)) {
				toast.error(res?.message || "Could not delete the file");
				setDeleting(item.__key, false);
				return;
			}
			toast.success("File deleted");
			setNewObjects((prev) => prev.filter((f) => f.__key !== item.__key));
			seenKeysRef.current.delete(item.__key);
			setCountAll((prev) =>
				typeof prev === "number" ? Math.max(0, prev - 1) : prev,
			);
			setDeleting(item.__key, false);
		},
		[seenKeysRef, setCountAll, setNewObjects],
	);

	/* ------------------------------- Derived list --------------------------- */

	const items = useMemo(
		() =>
			newobjects.map((file) => ({
				key: file.__key,
				raw: file,
				filename: file?.location?.filename || "unknown",
				url: file?.location?.secure_location || "",
				size: file?.size,
				info: classifyFile(file),
			})),
		[newobjects],
	);

	/* ------------------------------ Media elements -------------------------- */

	const { pauseAllMedia, registerMediaElement, forgetMediaElement } =
		useMediaElements();

	/* -------------------------------- Uploading ----------------------------- */

	// Uploads run in parallel, but the theme is updated one file at a time so two
	// requests never read and save the same document concurrently.
	const attachFileToRecord = useCallback(
		(fileId) => {
			const run = () =>
				object?._id && fileId
					? safeFetch(
							`/noadmin/themes/${object._id}/files`,
							"PUT",
							"no-cache",
							{ file: fileId },
							undefined,
							false,
							false,
						)
					: { status: "error", message: "Missing theme or file id" };
			// safeFetch never rejects, so one failure cannot break the chain.
			const next = attachQueueRef.current.then(run);
			attachQueueRef.current = next;
			return next;
		},
		[object?._id],
	);

	const finishUpload = useCallback(
		(fileObj, serverObj) => {
			const loc = serverObj.location || {};
			// With no remote URL the list keeps showing the local preview, so
			// that URL has to outlive the tray card.
			if (loc.secure_location) {
				revokeObjectUrl(fileObj.url);
			} else {
				keepObjectUrl(fileObj.url);
			}
			forgetMediaElement(fileObj.id);
			setFiles((prev) => prev.filter((f) => f.id !== fileObj.id));

			insertItem({
				_id: serverObj._id,
				title: serverObj.title || fileObj.name,
				size:
					typeof serverObj.size === "number" ? serverObj.size : fileObj.size,
				format_type: serverObj.format_type || fileObj.type,
				createdAt: serverObj.createdAt || new Date().toISOString(),
				location: {
					filename: loc.filename || fileObj.name,
					secure_location: loc.secure_location || fileObj.url,
					public_id: loc.public_id,
				},
			});
		},
		[insertItem, revokeObjectUrl, keepObjectUrl, forgetMediaElement],
	);

	const attachAndFinish = useCallback(
		async (fileObj, serverObj) => {
			setFiles((prev) =>
				prev.map((f) =>
					f.id === fileObj.id
						? {
								...f,
								uploading: true,
								attaching: true,
								progress: 100,
								uploadError: null,
							}
						: f,
				),
			);
			const res = await attachFileToRecord(serverObj._id);
			if (!isMountedRef.current) {
				return;
			}
			if (isFailure(res)) {
				const message =
					res?.message || "Could not attach the file to the theme";
				toast.error(message);
				// The upload itself succeeded, so keep the server file for a retry
				// instead of uploading the same bytes again.
				setFiles((prev) =>
					prev.map((f) =>
						f.id === fileObj.id
							? {
									...f,
									uploading: false,
									attaching: false,
									uploadError: message,
									uploadedFile: serverObj,
								}
							: f,
					),
				);
				return;
			}
			finishUpload(fileObj, serverObj);
		},
		[attachFileToRecord, finishUpload],
	);

	const addAndUploadFile = useCallback(
		(fileObj) => {
			if (!isMountedRef.current) {
				revokeObjectUrl(fileObj.url);
				return;
			}
			setFiles((prev) => [
				...prev,
				{ ...fileObj, uploading: true, progress: 0, uploadError: null },
			]);

			const { res, xhr } = uploadFileToServer({
				blob: fileObj.blob,
				filename: fileObj.name,
				token,
				fields: {
					...uploaderFields(auth),
					// Themes are Blog records with postType "theme".
					onModel: "Blog",
					resourceId: object?._id,
					album: "themes",
				},
				onProgress: (progress) => {
					if (!isMountedRef.current) return;
					setFiles((prev) =>
						prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)),
					);
				},
			});

			uploadXhrsRef.current.set(fileObj.id, xhr);

			res
				.then(({ file: uploaded }) => {
					if (!isMountedRef.current) {
						return;
					}
					const serverObj = uploaded?.data || uploaded || {};
					if (!serverObj._id) {
						throw new Error("Upload finished but the server sent no file id");
					}
					// The bytes are on the server; aborting now would cancel nothing.
					uploadXhrsRef.current.delete(fileObj.id);
					return attachAndFinish(fileObj, serverObj);
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
		[attachAndFinish, revokeObjectUrl, auth, token, object],
	);

	const handleFileUpload = (e) => {
		// Copied before the input is reset, which empties its FileList.
		const selected = Array.from(e.target.files || []);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		const accepted = selected.filter(isAcceptedFile);
		if (accepted.length < selected.length) {
			toast.error("Only image and video files can be uploaded here.");
		}
		// A File already is a Blob, so it is uploaded as-is.
		accepted.forEach((file) => {
			addAndUploadFile({
				id: generateId(),
				blob: file,
				url: createObjectUrl(file),
				name: file.name,
				type: getFileType(file.type),
				size: file.size,
			});
		});
	};

	const openFilePicker = () => {
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

	const retryAttach = (file) => {
		if (file?.uploadedFile && !file.attaching) {
			attachAndFinish(file, file.uploadedFile);
		}
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

	const takePhoto = () => {
		const video = videoPreviewRef.current;
		if (!video || !streamRef.current) {
			return;
		}
		// Before the first frame arrives the size is 0x0 and toBlob gives null.
		if (!video.videoWidth || !video.videoHeight) {
			toast.info("The camera is still starting. Try again in a moment.");
			return;
		}
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}
		ctx.drawImage(video, 0, 0);
		canvas.toBlob((blob) => {
			if (!blob || !isMountedRef.current) {
				return;
			}
			addAndUploadFile({
				id: generateId(),
				blob,
				url: createObjectUrl(blob),
				name: `photo_${Date.now()}.png`,
				type: "image",
				size: blob.size,
			});
		}, "image/png");
	};

	const startRecording = () => {
		if (!streamRef.current || mediaRecorderRef.current) {
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

	/* ----------------------------- Reorder uploads -------------------------- */

	const {
		draggedIndex,
		dragOverIndex,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleDragEnd,
	} = useUploadReorder(setFiles, uploadsRef);

	/* --------------------------------- Search ------------------------------- */

	const {
		keyword,
		setKeyword,
		debouncedKeyword,
		searchData,
		clearSearch,
		displayedItems,
	} = useListSearch(items, (item) => item?.raw?.title || item.filename);

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
							Theme Files Manager
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
									multiple
									className="d-none"
									id="fileInput"
								/>
								<button
									type="button"
									className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={openFilePicker}
								>
									<i aria-hidden className="fa-solid fa-upload" />
									Upload Files
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
										<button
											type="button"
											className="btn btn-info btn-sm"
											onClick={takePhoto}
										>
											<i
												aria-hidden
												className="fa-solid fa-camera align-middle me-1"
											/>
											Take Photo
										</button>
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
									No files yet. Upload or capture media to get started.
								</p>
								<small>Drag files to reorder them</small>
							</div>
						) : (
							<div className="d-flex flex-nowrap gap-3 overflow-auto pb-3 scroll-thin">
								{files.map((file, index) => (
									<div
										key={file.id}
										className="flex-shrink-0"
										style={{ width: "280px" }}
										draggable={!file.uploading}
										onDragStart={(e) => handleDragStart(e, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, index)}
										onDragEnd={handleDragEnd}
									>
										<div
											className={`card h-100 position-relative ${
												draggedIndex === index ? "opacity-50" : ""
											} ${
												dragOverIndex === index ? "border-primary border-2" : ""
											}`}
											style={{ cursor: file.uploading ? "wait" : "grab" }}
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
														<small className="text-muted">
															{file.attaching ? "Attaching..." : "Uploading..."}
														</small>
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
													{file.uploadError && !file.uploadedFile && (
														<small
															className="text-danger"
															title={file.uploadError}
														>
															Upload failed
														</small>
													)}
													{file.uploadError && file.uploadedFile && (
														<button
															type="button"
															className="btn btn-sm btn-outline-warning py-0"
															onClick={() => retryAttach(file)}
															title={file.uploadError}
														>
															Retry attach
														</button>
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
								<li>Upload image or video files using the upload button</li>
								<li>Use the camera to take photos or record video</li>
								<li>Drag and drop cards to reorder your media files</li>
								<li>Click the trash icon to remove individual files</li>
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
				<>
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
							<div className="float-end my-1">{countBadge}</div>
						</div>
					</div>
					{/* Dismissed through state: Bootstrap's data-bs-dismiss would remove
              nodes React still owns. */}
					{debouncedKeyword && displayedItems.length === 0 && (
						<div
							className="alert alert-info alert-dismissible rounded-0 mb-1"
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
					<div className="row g-3">
						{displayedItems.map((item, index) => (
							<Single
								key={item.key}
								index={index}
								object={item}
								handleDelete={handleDeleteIt}
								isDeleting={deletingKeys.has(item.key)}
							/>
						))}
					</div>
				</>
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

export default ThemesMediaManager;
