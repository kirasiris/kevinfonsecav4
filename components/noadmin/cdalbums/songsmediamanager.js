"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { formatFileSize } from "@/helpers/formatFileSize";
import Single from "./songsingle";
import {
	useInfiniteList,
	useListActions,
	useListReorder,
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

// Used while a search filter is active: drop indexes refer to the filtered
// list, so reordering it would move the wrong items in the full list.
const DRAG_DISABLED = { draggable: false, style: {}, className: "" };

/* -------------------------------------------------------------------------- */
/* Upload helpers                                                             */
/* -------------------------------------------------------------------------- */

const ACCEPTED_FILE_TYPES = "audio/*";

const isAcceptedFile = (file) => matchesAccept(file, ACCEPTED_FILE_TYPES);

// The file is already stored when this runs; failing here reports the error
// instead of listing an entry that has no record behind it.
const createSongRecord = async (parsed, object) => {
	const record = await safeFetch(
		`/noadmin/songs`,
		"POST",
		"no-cache",
		{
			resourceId: object?._id,
			duration: "0:0",
			status: "draft",
			averageRating: 5,
			onModel: "Playlist",
			title: parsed?.data?.title,
			sub_title: parsed?.data?.title,
			text: "No description",
			files: {
				audio_url: parsed?.data?._id,
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

const SongsMediaManager = ({
	auth = {},
	token = {},
	object = {},
	objects = [],
	searchParams = {},
}) => {
	/* ------------------------------ Paging setup ---------------------------- */

	const {
		initialPage,
		limit,
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
		endpoint: "/global/songs",
		query: `resourceId=${object?._id}`,
		defaultSort: "orderingNumber",
		failMessage: "Failed to retrieve songs",
	});

	/* ------------------------------- List state ----------------------------- */

	const isMountedRef = useRef(false);
	/* ------------------------------ Upload state ---------------------------- */

	const [files, setFiles] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [showMicrophone, setShowMicrophone] = useState(false);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [pendingMediaType, setPendingMediaType] = useState(null);
	const [permissions, setPermissions] = useState({ audio: false });
	const fileInputRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const chunksRef = useRef([]);
	const waveformRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const animationFrameRef = useRef(null);
	const uploadsRef = useRef([]);
	const uploadXhrsRef = useRef(new Map());
	const startingMediaRef = useRef(false);

	/* -------------------------------- Lifecycle ----------------------------- */

	useEffect(() => {
		uploadsRef.current = files;
	}, [files]);

	useEffect(() => {
		// Strict Mode runs this cleanup on its fake unmount, so the flag has to
		// be set back to true on every setup.
		isMountedRef.current = true;
		const animFrame = animationFrameRef;
		const audioCtx = audioContextRef;
		const analyser = analyserRef;
		const recorder = mediaRecorderRef;
		const stream = streamRef;
		const xhrs = uploadXhrsRef;
		return () => {
			isMountedRef.current = false;
			if (animFrame.current) cancelAnimationFrame(animFrame.current);
			animFrame.current = null;
			audioCtx.current?.close().catch(() => {});
			audioCtx.current = null;
			analyser.current = null;
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
		endpoint: "/noadmin/songs",
		noun: "song",
		bulkBody: { onModel: "Playlist", resourceId: object?._id },
		// A reorder of rows that no longer exist must not stay pending.
		onAllDeleted: () => setIsDirty(false),
	});

	/* ------------------------------- Derived list --------------------------- */

	const items = useMemo(
		() =>
			newobjects.map((file) => ({
				key: file.__key,
				raw: file,
				filename: file?.files?.audio_url?.location?.filename || "unknown",
				url: file?.files?.audio_url?.location?.secure_location || "",
				size: file?.files?.audio_url?.size,
				info: classifyFile(file?.files?.audio_url),
			})),
		[newobjects],
	);

	/* ------------------------------ Media elements -------------------------- */

	const { pauseAllMedia, registerMediaElement, forgetMediaElement } =
		useMediaElements();

	/* -------------------------------- Uploading ----------------------------- */

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
					onModel: "Playlist",
					resourceId: object?._id,
					album: "albums",
				},
				onProgress: (progress) => {
					if (!isMountedRef.current) return;
					setFiles((prev) =>
						prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)),
					);
				},
				afterUpload: (parsed) => createSongRecord(parsed, object),
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
						// /noadmin/songs/:id, which expects the record.
						_id: recordData._id,
						status: recordData.status || "draft",
						title: recordData.title || serverObj.title || fileObj.name,
						createdAt: serverObj.createdAt || new Date().toISOString(),
						files: {
							audio_url: {
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
		const accepted = selected.filter(isAcceptedFile);
		if (accepted.length < selected.length) {
			toast.error("Only audio files can be uploaded here.");
		}
		// A File already is a Blob, so it is uploaded as-is.
		accepted.forEach((file) => {
			addAndUploadFile({
				id: generateId(),
				blob: file,
				url: createObjectUrl(file),
				name: file.name,
				type: getFileType(file.type, "audio"),
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
					["microphone"].map((name) =>
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
		// would keep the microphone on with nothing left to stop it.
		if (startingMediaRef.current || streamRef.current) {
			return false;
		}
		startingMediaRef.current = true;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			// The user may have left the page while the browser prompt was open.
			if (!isMountedRef.current) {
				stream.getTracks().forEach((track) => track.stop());
				return false;
			}
			streamRef.current = stream;
			setupAudioVisualization(stream);
			setShowMicrophone(true);
			return true;
		} catch (err) {
			console.error("Error accessing media devices:", err);
			toast.error(
				"Could not access the microphone. Please check your browser permission settings.",
			);
			setPermissions((prev) => ({ ...prev, [type]: false }));
			return false;
		} finally {
			startingMediaRef.current = false;
		}
	};

	const setupAudioVisualization = (stream) => {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) {
			return;
		}
		// Browsers cap the number of live AudioContexts; close any previous one.
		audioContextRef.current?.close().catch(() => {});
		const audioContext = new AudioCtx();
		audioContextRef.current = audioContext;

		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		analyserRef.current = analyser;

		const source = audioContext.createMediaStreamSource(stream);
		source.connect(analyser);
	};

	useEffect(() => {
		if (!showMicrophone || !waveformRef.current || !analyserRef.current) {
			return;
		}

		const analyser = analyserRef.current;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const container = waveformRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = container.offsetWidth || 500;
		canvas.height = 80;
		canvas.style.width = "100%";
		canvas.style.height = "80px";
		container.replaceChildren(canvas);

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return () => container.replaceChildren();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, "#dc3545");
		gradient.addColorStop(1, "#ffc107");

		const draw = () => {
			animationFrameRef.current = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "#6c757d";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				const barHeight = (dataArray[i] / 255) * canvas.height;
				ctx.fillStyle = gradient;
				ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
				x += barWidth + 1;
			}
		};

		draw();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			container.replaceChildren();
		};
	}, [showMicrophone]);

	const stopAudioVisualization = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		audioContextRef.current?.close().catch(() => {});
		audioContextRef.current = null;
		analyserRef.current = null;
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
			const mimeType = mediaRecorder.mimeType || "audio/webm";
			const blob = new Blob(chunks, { type: mimeType });
			chunks.length = 0;
			if (blob.size === 0) {
				return;
			}
			const ext = mimeType.includes("mp4")
				? "m4a"
				: mimeType.includes("ogg")
					? "ogg"
					: "webm";
			addAndUploadFile({
				id: generateId(),
				blob,
				url: createObjectUrl(blob),
				name: `audio_${Date.now()}.${ext}`,
				type: "audio",
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
		stopAudioVisualization();
		setShowMicrophone(false);
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

	/* ------------------------------ Reorder list ---------------------------- */

	const {
		itemDraggedIndex,
		itemDragOverIndex,
		isDirty,
		saving,
		setIsDirty,
		saveError,
		setSaveError,
		success,
		setSuccess,
		handleItemDragStart,
		handleItemDragOver,
		handleItemDragLeave,
		handleItemDrop,
		handleItemDragEnd,
		handleSave,
	} = useListReorder({
		list: { setNewObjects, newobjects, initialPage, limit },
		saveEndpoint: `/noadmin/songs/${object?._id}/updateorder`,
	});

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

	const permissionLabel = "microphone";
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
							Songs Manager
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
									className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
									onClick={() => requestPermission("audio")}
									disabled={showMicrophone}
								>
									<i aria-hidden className="fa-solid fa-microphone" />
									Open Microphone
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
						{showMicrophone && (
							<div className="card mb-3 border-2 border-primary">
								<div className="card-body">
									<div className="text-center py-4">
										<div
											className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${
												isRecording ? "bg-danger" : "bg-secondary"
											}`}
											style={{ width: "80px", height: "80px" }}
										>
											<i
												aria-hidden
												className="fa-solid fa-microphone fa-3x text-white"
											/>
										</div>
										<div
											ref={waveformRef}
											aria-hidden
											className="mb-3 mx-auto rounded border border-secondary"
											style={{
												maxWidth: "500px",
												height: "80px",
												backgroundColor: "#f8f9fa",
											}}
										/>
										<p className="mt-2 mb-0" aria-live="polite">
											{isRecording ? (
												<span className="text-danger fw-bold">
													Recording...
												</span>
											) : (
												<span>Microphone ready</span>
											)}
										</p>
									</div>

									<div className="d-flex flex-wrap justify-content-center gap-2">
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
									No files yet. Upload or record audio to get started.
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
															file.type === "audio"
																? "text-warning"
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
													{file.type === "audio" && (
														<div
															className="d-flex align-items-center p-1 admin-multimedia-manager-audio-file"
															style={{ height: "150px" }}
														>
															<audio
																ref={(el) => registerMediaElement(file.id, el)}
																src={file.url}
																controls
																preload="metadata"
																className="w-100"
																onPlay={() => pauseAllMedia(file.id)}
															/>
														</div>
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
								<li>Upload audio files using the upload button</li>
								<li>Use the microphone to record audio</li>
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
							<div className="float-end my-1">
								<div className="btn-group">
									{isDirty && (
										<button
											type="button"
											className="btn btn-success btn-sm"
											onClick={handleSave}
											disabled={saving}
										>
											{saving ? (
												<>
													<span
														className="spinner-border spinner-border-sm me-1"
														role="status"
														aria-hidden="true"
													/>
													Saving...
												</>
											) : (
												<>
													<i
														aria-hidden
														className="fa-solid fa-floppy-disk me-1"
													/>
													Save Order
												</>
											)}
										</button>
									)}
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
						<div className="card-body">
							<small className="text-muted">
								{debouncedKeyword
									? "Clear the search to reorder."
									: "Drag the cards to reorder, then save your changes."}
							</small>
						</div>
					</div>
					{/* Dismissed through state: Bootstrap's data-bs-dismiss would remove
              nodes React still owns. */}
					{saveError && (
						<div
							className="alert alert-danger alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							{saveError}
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => setSaveError("")}
							/>
						</div>
					)}
					{success && (
						<div
							className="alert alert-success alert-dismissible rounded-0 mb-0"
							role="alert"
						>
							{success}
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => setSuccess("")}
							/>
						</div>
					)}
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
					<div className="row g-3">
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
								dragProps={
									debouncedKeyword
										? DRAG_DISABLED
										: {
												draggable: true,
												onDragStart: (e) => handleItemDragStart(e, index),
												onDragOver: (e) => handleItemDragOver(e, index),
												onDragLeave: handleItemDragLeave,
												onDrop: (e) => handleItemDrop(e, index),
												onDragEnd: handleItemDragEnd,
												style: { cursor: "grab" },
												className: `${
													itemDraggedIndex === index ? "opacity-50" : ""
												} ${
													itemDragOverIndex === index
														? "border border-primary border-2 rounded"
														: ""
												}`,
											}
								}
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

export default SongsMediaManager;
