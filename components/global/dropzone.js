"use client";
import axios from "axios";
import { useState } from "react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UseProgress from "@/components/global/useprogress";

const UseDropzone = ({
	auth = {},
	token = null,
	id = "",
	name = "",
	multipleFiles = true,
	onModel = "Blog",
	revalidateUrl = ``,
}) => {
	const router = useRouter();
	const [uploadPercentage, setUploadPercentage] = useState(0);

	console.log("Auth in @/components/global/dropzone file", auth);
	console.log("Token in @/components/global/dropzone file", token);

	return (auth?.userId !== "" &&
		auth?.userId !== undefined &&
		auth?.userId !== null) ||
		(auth?.username !== "" &&
			auth?.username !== undefined &&
			auth?.username !== null) ||
		(auth?.email !== "" &&
			auth?.email !== undefined &&
			auth?.email !== null) ? (
		<>
			<UseProgress percentage={uploadPercentage} />
			<Dropzone
				// accept={}
				onDrop={async (acceptedFiles) => {
					for (let i = 0; i < acceptedFiles.length; i++) {
						await axios.put(
							`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
							{
								userId: auth?.userId,
								username: auth?.username,
								userEmail: auth?.email,
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
					router.push(revalidateUrl);
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps({
							className: "dropzone mb-3",
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
				)}
			</Dropzone>
		</>
	) : (
		<div className="alert alert-warning">
			Sorry you can not use the uploader
		</div>
	);
};

export default UseDropzone;
