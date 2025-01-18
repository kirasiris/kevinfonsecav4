"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";

const UseDropzone = ({
	auth = {},
	token = null,
	accepted = [],
	id,
	name,
	multipleFiles,
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

	return (auth?.userId !== "" &&
		auth?.userId !== undefined &&
		auth?.userId !== null) ||
		(auth?.username !== "" &&
			auth?.username !== undefined &&
			auth?.username !== null) ||
		(auth?.email !== "" &&
			auth?.email !== undefined &&
			auth?.email !== null) ? (
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
							})
						),
					});

					// Upload files
					const uploadPromises = acceptedFiles.map(async (file) => {
						const res = await axios.put(
							`${process.env.apiUrl}/uploads/uploadobject`,
							{
								userId: auth?.userId,
								username: auth?.username,
								userEmail: auth?.email,
								onModel: onModel,
								resourceId: object?._id,
								file: file,
							},
							{
								headers: {
									Authorization: `Bearer ${token?.value}`,
									"Content-Type": "multipart/form-data",
								},
								onUploadProgress: (ProgressEvent) => {
									setUploadPercentage(
										parseInt((ProgressEvent.loaded * 100) / ProgressEvent.total)
									);
									setTimeout(() => setUploadPercentage(0), 10000);
								},
							}
						);
						return res?.data?.data?._id;
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
	) : (
		<div className="alert alert-warning">
			Sorry you can not use the uploader
		</div>
	);
};

export default UseDropzone;
