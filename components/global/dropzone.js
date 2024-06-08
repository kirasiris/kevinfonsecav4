"use client";
import axios from "axios";
import { useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";

const UseDropzone = ({
	auth = {},
	token = null,
	id,
	name,
	multipleFiles,
	onModel = "Blog",
}) => {
	const [files, setFiles] = useState({
		media: [],
		previews: [],
		uploaded: [],
		mediaLength: 0,
		selected: null,
		showMediaModal: false,
		playlist: [],
	});
	const [uploadPercentage, setUploadPercentage] = useState(0);
	return (
		<>
			<UseProgress percentage={uploadPercentage} />
			<Dropzone
				onDrop={async (acceptedFiles) => {
					const newMedia = [...files.media, ...acceptedFiles];
					const newPreviews = newMedia
						.filter((file) => acceptedFiles.includes(file))
						.map((file) => {
							if (file instanceof Blob || file instanceof File) {
								return {
									...file,
									preview: URL.createObjectURL(file),
								};
							}
							return file;
						});

					for (let i = 0; i < acceptedFiles.length; i++) {
						await axios.put(
							`http://localhost:5000/api/v1/uploads/uploadobject`,
							{
								userId: auth?.data?._id,
								username: auth?.data?.username,
								userEmail: auth?.data?.email,
								onModel: onModel,
								file: acceptedFiles[i],
							},
							{
								headers: {
									Authorization: `Bearer ${token?.value}`,
									"Content-Type": "multipart/form-data",
								},
								onUploadProgress: (ProgressEvent) => {
									setUploadPercentage(
										parseInt(
											Math.round(ProgressEvent.loaded * 100) /
												ProgressEvent.total
										)
									);
									setTimeout(() => setUploadPercentage(0), 10000);
								},
							}
						);
					}
					setUploadPercentage(0);
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<div className="dropzone-root mb-3">
						<div
							{...getRootProps({
								className: "dropzone",
								onDrop: (event) => {
									event.stopPropagation();
								},
							})}
						>
							<input
								{...getInputProps({
									id,
									name,
									multiple: { multipleFiles },
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
							</div>
						</div>
					</div>
				)}
			</Dropzone>
		</>
	);
};

export default UseDropzone;
