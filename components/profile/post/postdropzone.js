"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";

const UseDropzone = ({
	auth = {},
	token = null,
	accepted = [],
	id = "",
	name = "",
	multipleFiles = true,
	onModel = "Blog",
	object = {},
	objectData = {},
	setObjectData = () => {},
}) => {
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [previews, setPreviews] = useState({
		files: [],
		thumbnails: [],
	});

	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () =>
			previews.files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);

	return (
		<div className="mt-3 mb-3">
			<UseProgress percentage={uploadPercentage} />
			<Dropzone
				accept={accepted}
				multiple={multipleFiles}
				onDrop={async (acceptedFiles) => {
					// Create previews
					setPreviews({
						...previews,
						files: acceptedFiles.map((file) =>
							Object.assign(file, {
								preview: URL.createObjectURL(file),
							}),
						),
					});

					// Upload files
					const uploadPromises = acceptedFiles.map(async (file) => {
						try {
							const res = await new Promise((resolve, reject) => {
								const formData = new FormData();
								formData.append("userId", auth?.data?._id);
								formData.append("username", auth?.data?.username);
								formData.append("userEmail", auth?.data?.email);
								formData.append("onModel", onModel);
								formData.append("resourceId", object?._id);
								formData.append("file", file);
								formData.append("album", "posts");

								const xhr = new XMLHttpRequest();

								xhr.upload.addEventListener("progress", (event) => {
									if (event.lengthComputable) {
										setUploadPercentage(
											Math.round((event.loaded * 100) / event.total),
										);
										setTimeout(() => setUploadPercentage(0), 10000);
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
									reject(new Error("Upload aborted")),
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
							return res?.data?._id;
						} catch (err) {
							toast.error(err?.message || "Something went wrong during upload");
						} finally {
							toast.success("Files uploaded");
						}
					});

					const uploadedFiles = await Promise.all(uploadPromises);

					// Update state by appending newly uploaded files to the existing files array
					setObjectData({
						...objectData,
						files: [...objectData.files, ...uploadedFiles],
					});

					// Reset progress bar to zero
					setUploadPercentage(0);
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps({
							className: "dropzone text-center",
							onDrop: (event) => {
								event.stopPropagation();
							},
						})}
					>
						<input
							{...getInputProps({
								id,
								name,
							})}
						/>
						<div className="dropzone-icons">
							<Image
								alt="upload"
								className="dropzone-image"
								src="https://s3-us-west-1.amazonaws.com/youtube-clone-assets/upload-background.svg"
								width="92"
								height="65"
							/>
							<p className="dropzone-paragraph m-0">
								Drag &apos;n&apos; drop some files here, or click to select
								files
							</p>
							<p>ONLY IMAGE FILES ARE ALLOWED</p>
						</div>
						<aside
							style={{
								display: "flex",
								flexDirection: "row",
								flexWrap: "wrap",
								marginTop: 16,
							}}
						>
							{previews.files.map((file) => (
								<div
									style={{
										display: "inline-flex",
										borderRadius: 2,
										border: "1px solid #eaeaea",
										marginBottom: 8,
										marginRight: 8,
										width: 100,
										height: 100,
										padding: 4,
										boxSizing: "border-box",
									}}
									key={file.name}
								>
									<div
										style={{
											display: "flex",
											minWidth: 0,
											overflow: "hidden",
										}}
									>
										{(file.path.includes(".mp4") ||
											file.path.includes(".avi")) && (
											<video controls>
												<source src={file.preview} type={file.type} />
											</video>
										)}
										{(file.path.includes(".png") ||
											file.path.includes(".jpeg") ||
											file.path.includes(".jpg")) && (
											<Image
												src={file.preview}
												style={{
													display: "block",
													width: "auto",
												}}
												width={"162"}
												height={"91"}
												// Revoke data uri after image is loaded
												onLoad={() => {
													URL.revokeObjectURL(file.preview);
												}}
												alt=""
											/>
										)}
									</div>
								</div>
							))}
						</aside>
					</div>
				)}
			</Dropzone>
		</div>
	);
};

export default UseDropzone;
