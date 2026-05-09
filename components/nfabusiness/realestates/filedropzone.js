"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UseProgress from "@/components/global/useprogress";
import { fetchurl } from "@/helpers/setTokenOnServer";

const UseDropzone = ({
	auth = {},
	token = null,
	id = "",
	name = "",
	multipleFiles = true,
	object = {},
}) => {
	const router = useRouter();
	const [uploadPercentage, setUploadPercentage] = useState(0);

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
				// accept={{ "audio/*": [".mp3"] }}
				multiple={multipleFiles}
				onDrop={async (acceptedFiles) => {
					for (let i = 0; i < acceptedFiles.length; i++) {
						try {
							const res = await new Promise((resolve, reject) => {
								const formData = new FormData();
								formData.append("userId", auth?.userId);
								formData.append("username", auth?.username);
								formData.append("userEmail", auth?.email);
								formData.append("onModel", "Product");
								formData.append("resourceId", object?._id);
								formData.append("file", acceptedFiles[i]);
								formData.append("album", "products");

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

							await fetchurl(
								`/noadmin/stripe/realestates/${object?._id}/files`,
								"PUT",
								"no-cache",
								{
									file: res?.data?._id,
								},
								undefined,
								false,
								false,
							);
						} catch (err) {
							toast.error(
								err?.message || "Something went wrong during upload",
								"bottom",
							);
						} finally {
							toast.success("Files uploaded", "bottom");
						}
					}
					setUploadPercentage(0);
					router.push(`/nfabusiness/realestates/read/${object?._id}`);
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
