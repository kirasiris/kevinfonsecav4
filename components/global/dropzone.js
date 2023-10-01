"use client";
import axios from "axios";
import { useContext, useState } from "react";
import Dropzone from "react-dropzone";
import UseProgress from "@/components/global/useprogress";
import AuthContext from "@/helpers/globalContext";

const UseDropzone = ({
	id,
	name,
	multipleFiles,
	onModel = "Blog",
	showDropzone,
	setShowDropzone,
}) => {
	const { auth, files, setFiles } = useContext(AuthContext);
	const [uploadPercentage, setUploadPercentage] = useState(0);
	return (
		showDropzone && (
			<>
				<UseProgress percentage={uploadPercentage} />
				<Dropzone
					onDrop={async (acceptedFiles) => {
						setFiles({
							...files,
							media: acceptedFiles,
							previews: acceptedFiles.map((file) => ({
								...file,
								preview: URL.createObjectURL(file),
							})),
							mediaLength: acceptedFiles.length,
						});
						// HERE YOU CAN MANAGE FILES UPLOADED
						for (let i = 0; i < acceptedFiles.length; i++) {
							const res = await axios.put(
								`/uploads/uploadObject`,
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
							setFiles({
								...files,
								media: [...files.media, res?.data?.data],
							});
						}
						setShowDropzone(false);
						setUploadPercentage(0);
					}}
				>
					{({ getRootProps, getInputProps }) => (
						<div className="dropzone-root">
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
										multiple: { multipleFiles },
									})}
								/>
								<img
									alt="upload"
									className="dropzone-image"
									src="https://s3-us-west-1.amazonaws.com/youtube-clone-assets/upload-background.svg"
								/>
								<p>
									Drag &apos;n&apos; drop some files here, or click to select
									files
								</p>
							</div>
						</div>
					)}
				</Dropzone>
			</>
		)
	);
};

export default UseDropzone;
