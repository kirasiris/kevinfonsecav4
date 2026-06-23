"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { formatFileSize } from "@/helpers/formatFileSize";
import { useUploadBridge } from "@/context/uploadbridgecontext";

const generateId = () => Math.random().toString(36).slice(2, 9);

const getFileType = (mimeType = "") => {
	if (mimeType.startsWith("audio/")) return "audio";
	if (mimeType.startsWith("video/")) return "video";
	if (mimeType.startsWith("image/")) return "image";
	return "video";
};

// Uploads a single file using XHR so we can track progress. Returns an object
// containing both a Promise that resolves with the parsed response and the
// underlying XHR instance — so callers can abort the upload mid-flight (for
// example when the user removes the file before the upload finishes).
const uploadFileToServer = (
	blob,
	filename,
	onProgress,
	auth = {},
	token = {},
	onModel = "Blog",
) => {
	const xhr = new XMLHttpRequest();
	const promise = new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append("userId", auth?.data?._id);
		formData.append("username", auth?.data?.username);
		formData.append("userEmail", auth?.data?.email);
		formData.append("onModel", onModel);
		formData.append("file", blob, filename);
		formData.append("album", "settings");

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable) {
				onProgress(Math.round((event.loaded * 100) / event.total));
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const parsed = JSON.parse(xhr.responseText);
				resolve(parsed);
			} else {
				reject(
					new Error(
						`Upload failed with status ${xhr.status}: ${xhr.statusText}`,
					),
				);
			}
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

	return { promise, xhr };
};

const UseDropzone = ({ auth = {}, token = null, onModel = "Blog" }) => {
	const uploadBridge = useUploadBridge();
	const [files, setFiles] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingType, setRecordingType] = useState(null);
	const [showCamera, setShowCamera] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [dragOverIndex, setDragOverIndex] = useState(null);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [pendingMediaType, setPendingMediaType] = useState(null);
	// Track which permissions have already been granted so we don't keep asking.
	const [permissions, setPermissions] = useState({
		video: false,
		audio: false,
	});

	const fileInputRef = useRef(null);
	const videoPreviewRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const streamRef = useRef(null);
	const chunksRef = useRef([]);
	const mediaElementsRef = useRef(new Map());
	const waveformRef = useRef(null);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const animationFrameRef = useRef(null);
	const filesRef = useRef([]);
	// Track in-flight XHRs by file id so removeFile can abort them.
	const uploadXhrsRef = useRef(new Map());

	useEffect(() => {
		filesRef.current = files;
	}, [files]);

	const pauseAllMedia = (exceptId) => {
		mediaElementsRef.current.forEach((element, id) => {
			if (id !== exceptId && !element.paused) element.pause();
		});
	};

	const registerMediaElement = (id, element) => {
		if (element) mediaElementsRef.current.set(id, element);
		else mediaElementsRef.current.delete(id);
	};

	// Adds a new file to state in "uploading" mode and kicks off the upload.
	const addAndUploadFile = useCallback(
		(fileObj) => {
			setFiles((prev) => [
				...prev,
				{ ...fileObj, uploading: true, progress: 0, uploadError: null },
			]);

			const { promise, xhr } = uploadFileToServer(
				fileObj.blob,
				fileObj.name,
				(progress) => {
					setFiles((prev) =>
						prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f)),
					);
				},
				auth,
				token,
				onModel,
			);

			uploadXhrsRef.current.set(fileObj.id, xhr);

			promise
				.then((response) => {
					setFiles((prev) =>
						prev.map((f) =>
							f.id === fileObj.id
								? { ...f, uploading: false, progress: 100 }
								: f,
						),
					);

					const serverObj = response?.data || response || {};
					const loc = serverObj.location || {};
					uploadBridge?.publish({
						_id: serverObj._id,
						size:
							typeof serverObj.size === "number"
								? serverObj.size
								: fileObj.size,
						format_type: serverObj.format_type || fileObj.type,
						createdAt: serverObj.createdAt || new Date().toISOString(),
						location: {
							filename: loc.filename || fileObj.name,
							secure_location: loc.secure_location || fileObj.url,
							public_id: loc.public_id,
						},
					});
				})
				.catch((err) => {
					// If the user aborted by removing the file, the row is already gone —
					// there's nothing to update in state.
					if (err?.name === "AbortError") return;
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
		[uploadBridge],
	);

	const handleFileUpload = (e) => {
		const selectedFiles = e.target.files;
		if (!selectedFiles) {
			return;
		}

		Array.from(selectedFiles).forEach((file) => {
			const blob = new Blob([file], { type: file.type });
			addAndUploadFile({
				id: generateId(),
				blob,
				url: URL.createObjectURL(blob),
				name: file.name,
				type: getFileType(file.type),
				size: file.size,
			});
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeFile = (id) => {
		// Abort the in-flight upload (if any) so we don't waste bandwidth.
		const xhr = uploadXhrsRef.current.get(id);
		if (xhr) {
			xhr.abort();
			uploadXhrsRef.current.delete(id);
		}
		// Drop any associated media element reference.
		mediaElementsRef.current.delete(id);

		setFiles((prev) => {
			const fileToRemove = prev.find((f) => f.id === id);
			if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
			return prev.filter((f) => f.id !== id);
		});
	};

	const grantAndStart = async (type) => {
		const ok = await startCamera(type);
		if (ok) {
			// Camera implies audio too (constraints include audio: true)
			setPermissions((prev) =>
				type === "video"
					? { video: true, audio: true }
					: { ...prev, audio: true },
			);
		}
		return ok;
	};

	const requestPermission = async (type) => {
		// Skip the modal if we've already been granted permission this session.
		if (permissions[type]) {
			startCamera(type);
			return;
		}
		// The in-memory `permissions` flag resets on reload/remount, but the
		// browser persists the actual grant. Query the Permissions API so we
		// don't re-prompt for access the user already approved.
		try {
			if (navigator.permissions?.query) {
				const names =
					type === "video" ? ["camera", "microphone"] : ["microphone"];
				const states = await Promise.all(
					names.map((name) =>
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
			// Permissions API not supported for these names — fall back to the modal.
		}
		setPendingMediaType(type);
		setShowPermissionModal(true);
	};

	const handlePermissionGranted = async () => {
		const type = pendingMediaType;
		setShowPermissionModal(false);
		if (!type) {
			return;
		}
		await grantAndStart(type);
	};

	const handlePermissionDenied = () => {
		setShowPermissionModal(false);
		setPendingMediaType(null);
	};

	const startCamera = async (type) => {
		try {
			const constraints =
				type === "video" ? { video: true, audio: true } : { audio: true };
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			streamRef.current = stream;

			if (type === "video") {
				setShowCamera(true);
				setRecordingType(type);
			} else {
				setRecordingType(type);
				setupAudioVisualization(stream);
			}
			return true;
		} catch (err) {
			console.error("Error accessing media devices:", err);
			toast.error(
				"Could not access camera/microphone. Please check that you granted permission in your browser settings.",
			);
			// If the browser denied us, clear the cached permission flag.
			setPermissions((prev) =>
				type === "video"
					? { video: false, audio: false }
					: { ...prev, audio: false },
			);
			return false;
		}
	};

	const setupAudioVisualization = (stream) => {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) return;

		const audioContext = new AudioCtx();
		audioContextRef.current = audioContext;

		const analyser = audioContext.createAnalyser();
		analyser.fftSize = 256;
		analyserRef.current = analyser;

		const source = audioContext.createMediaStreamSource(stream);
		source.connect(analyser);
	};

	useEffect(() => {
		if (recordingType !== "audio" || showCamera) return;
		if (!waveformRef.current || !analyserRef.current) return;

		const analyser = analyserRef.current;
		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const container = waveformRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = container.offsetWidth || 500;
		canvas.height = 80;
		canvas.style.width = "100%";
		canvas.style.height = "80px";
		container.innerHTML = "";
		container.appendChild(canvas);

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, "#dc3545");
		gradient.addColorStop(1, "#ffc107");

		const draw = () => {
			animationFrameRef.current = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			// ctx.fillStyle = "#f8f9fa";
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
			if (container) container.innerHTML = "";
		};
	}, [recordingType, showCamera]);

	const stopAudioVisualization = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}
		if (audioContextRef.current) {
			audioContextRef.current.close().catch(() => {});
			audioContextRef.current = null;
		}
		analyserRef.current = null;
		if (waveformRef.current) waveformRef.current.innerHTML = "";
	};

	useEffect(() => {
		if (showCamera && streamRef.current && videoPreviewRef.current) {
			videoPreviewRef.current.srcObject = streamRef.current;
		}
	}, [showCamera]);

	useEffect(() => {
		// Snapshot the refs at effect-setup time so the cleanup function doesn't
		// close over the refs after they may have been re-assigned.
		const animFrame = animationFrameRef;
		const audioCtx = audioContextRef;
		const stream = streamRef;
		const filesSnap = filesRef;
		const uploads = uploadXhrsRef;
		return () => {
			if (animFrame.current) cancelAnimationFrame(animFrame.current);
			if (audioCtx.current) audioCtx.current.close().catch(() => {});
			if (stream.current) stream.current.getTracks().forEach((t) => t.stop());
			filesSnap.current.forEach((f) => URL.revokeObjectURL(f.url));
			uploads.current.forEach((xhr) => xhr.abort());
			uploads.current.clear();
		};
	}, []);

	const takePhoto = () => {
		if (!videoPreviewRef.current || !streamRef.current) return;
		const video = videoPreviewRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.drawImage(video, 0, 0);
		canvas.toBlob((blob) => {
			if (!blob) return;
			addAndUploadFile({
				id: generateId(),
				blob,
				url: URL.createObjectURL(blob),
				name: `photo_${Date.now()}.png`,
				type: "image",
				size: blob.size,
			});
		}, "image/png");
	};

	const startRecording = () => {
		if (!streamRef.current) return;

		chunksRef.current = [];
		const mediaRecorder = new MediaRecorder(streamRef.current);
		mediaRecorderRef.current = mediaRecorder;

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) chunksRef.current.push(e.data);
		};

		mediaRecorder.onstop = () => {
			const mimeType = recordingType === "video" ? "video/webm" : "audio/webm";
			const blob = new Blob(chunksRef.current, { type: mimeType });
			addAndUploadFile({
				id: generateId(),
				blob,
				url: URL.createObjectURL(blob),
				name: `${recordingType}_${Date.now()}.webm`,
				type: recordingType || "video",
				size: blob.size,
			});
		};

		mediaRecorder.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const closeCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
		stopAudioVisualization();
		setShowCamera(false);
		setRecordingType(null);
		setIsRecording(false);
	};

	const handleDragStart = (e, index) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	// dragover fires continuously while the mouse moves; only update state when
	// the hovered index actually changes to avoid pointless re-renders.
	const handleDragOver = useCallback((e, index) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setDragOverIndex((prev) => (prev === index ? prev : index));
	}, []);

	const handleDragLeave = () => setDragOverIndex(null);

	const handleDrop = useCallback(
		(e, dropIndex) => {
			e.preventDefault();
			if (draggedIndex === null || draggedIndex === dropIndex) {
				setDraggedIndex(null);
				setDragOverIndex(null);
				return;
			}
			setFiles((prev) => {
				const newFiles = [...prev];
				const [moved] = newFiles.splice(draggedIndex, 1);
				newFiles.splice(dropIndex, 0, moved);
				return newFiles;
			});
			setDraggedIndex(null);
			setDragOverIndex(null);
		},
		[draggedIndex],
	);

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	};

	const getMediaIcon = (type) => {
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

	const permissionLabel =
		pendingMediaType === "video" ? "camera and microphone" : "microphone";
	const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);

	return (
		<div className="mb-1">
			{showPermissionModal && (
				<div
					className="modal show d-block"
					tabIndex="-1"
					style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Permission Required</h5>
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

			<div className="card rounded-0">
				<div className="card-header">
					<h4 className="mb-0 d-flex align-items-center gap-2">
						<i aria-hidden className="fa-solid fa-upload" />
						Multimedia Manager
					</h4>
				</div>

				<div className="card-body">
					<div className="row g-3 mb-4">
						<div className="col-12 col-md-6 col-lg-3">
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileUpload}
								accept="audio/*,video/*,image/*"
								multiple
								className="d-none"
								id="fileInput"
							/>
							<button
								className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
								onClick={() => fileInputRef.current?.click()}
							>
								<i aria-hidden className="fa-solid fa-upload" />
								Upload Files
							</button>
						</div>

						<div className="col-12 col-md-6 col-lg-3">
							<button
								className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
								onClick={() => requestPermission("video")}
								disabled={showCamera || recordingType === "audio"}
							>
								<i aria-hidden className="fa-solid fa-camera" />
								Open Camera
							</button>
						</div>

						<div className="col-12 col-md-6 col-lg-3">
							<button
								className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
								onClick={() => requestPermission("audio")}
								disabled={showCamera || recordingType === "audio"}
							>
								<i aria-hidden className="fa-solid fa-microphone" />
								Open Microphone
							</button>
						</div>

						<div className="col-12 col-md-6 col-lg-3">
							<div className="bg-light rounded p-2 text-center">
								<small className="text-muted">
									{files.length} file{files.length !== 1 ? "s" : ""} •{" "}
									{formatFileSize(totalSize)}
								</small>
							</div>
						</div>
					</div>

					{(showCamera || recordingType === "audio") && (
						<div className="card mb-4 border-2 border-primary">
							<div className="card-body">
								{showCamera && (
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
								)}

								{recordingType === "audio" && !showCamera && (
									<div className="text-center py-4">
										<div
											className={`d-inline-flex align-items-center justify-content-center rounded-circle mb-3 ${isRecording ? "bg-danger" : "bg-secondary"}`}
											style={{ width: "80px", height: "80px" }}
										>
											<i
												aria-hidden
												className="fa-solid fa-microphone fa-3x text-white"
											/>
										</div>

										<div
											ref={waveformRef}
											className="mb-3 mx-auto rounded border border-secondary"
											style={{
												maxWidth: "500px",
												height: "80px",
												backgroundColor: "#f8f9fa",
											}}
										/>

										<p className="mt-2 mb-0">
											{isRecording ? (
												<span className="text-danger fw-bold">
													Recording...
												</span>
											) : (
												<span>Microphone ready</span>
											)}
										</p>
									</div>
								)}

								<div className="d-flex flex-wrap justify-content-center gap-2">
									{showCamera && (
										<button className="btn btn-info btn-sm" onClick={takePhoto}>
											<i aria-hidden className="fa-solid fa-camera me-1" />
											Take Photo
										</button>
									)}

									{!isRecording ? (
										<button
											className="btn btn-danger btn-sm"
											onClick={startRecording}
										>
											<i aria-hidden className="fa-solid fa-play me-1" />
											Start Recording
										</button>
									) : (
										<button
											className="btn btn-dark btn-sm"
											onClick={stopRecording}
										>
											<i aria-hidden className="fa-solid fa-stop me-1" />
											Stop Recording
										</button>
									)}
									<button
										className="btn btn-secondary btn-sm"
										onClick={closeCamera}
									>
										<i aria-hidden className="fa-solid fa-xmark me-1" />
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
										className={`card h-100 position-relative ${draggedIndex === index ? "opacity-50" : ""} ${dragOverIndex === index ? "border-primary border-2" : ""}`}
										style={{ cursor: file.uploading ? "wait" : "grab" }}
									>
										<div className="card-header d-flex justify-content-between align-items-center py-2">
											<div className="d-flex align-items-center gap-2">
												<span className="badge bg-secondary">{index + 1}</span>
												<span
													className={`text-${file.type === "audio" ? "warning" : file.type === "video" ? "success" : "info"}`}
												>
													{getMediaIcon(file.type)}
												</span>
											</div>
											{!file.uploading && (
												<button
													className="btn btn-sm btn-outline-danger"
													onClick={() => removeFile(file.id)}
													title="Remove file"
												>
													<i aria-hidden className="fa-regular fa-trash-can" />
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
														style={{ maxHeight: "150px", objectFit: "fill" }}
														onPlay={() => pauseAllMedia(file.id)}
													/>
												)}
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
													style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
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
							<li>
								Upload audio, video, or image files using the upload button
							</li>
							<li>Use the camera to take photos or record video</li>
							<li>Use the microphone to record audio</li>
							<li>Drag and drop cards to reorder your media files</li>
							<li>Click the trash icon to remove individual files</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UseDropzone;
