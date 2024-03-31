"use client";
import axios from "axios";
import { useContext, useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";
import AuthContext from "@/helpers/globalContext";

const UseDropzone = ({
	id,
	name,
	multipleFiles,
	onModel = "Blog",
	showDropzone,
	setShowDropzone,
	keepShowing = false,
}) => {
	const { auth, files, setFiles } = useContext(AuthContext);
	const [uploadPercentage, setUploadPercentage] = useState(0);
	return (
		showDropzone && (
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

						setFiles({
							media: newMedia,
							previews: [...files.previews, ...newPreviews],
							mediaLength: acceptedFiles.length,
						});

						for (let i = 0; i < acceptedFiles.length; i++) {
							const res = await axios.put(
								`/uploads/uploadobject`,
								{
									userId: auth?.user._id,
									username: auth?.user.username,
									userEmail: auth?.user.email,
									onModel: onModel,
									file: acceptedFiles[i],
								},
								{
									headers: {
										Authorization: `Bearer ${auth?.token}`,
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
							// https://zzzcode.ai/code-debug?id=d4089bcf-b450-42d5-9f05-5c73442b8477
							setFiles({
								...files,
								media: [res?.data?.data, ...files.media],
								uploaded: [...files.uploaded, res?.data?.data],
							});
						}
						setShowDropzone(keepShowing);
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
		)
	);
};

export default UseDropzone;
