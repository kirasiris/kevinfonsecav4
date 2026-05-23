"use client";
import { useState } from "react";
import { toast } from "react-toastify";
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
	const [btnText, setBtnText] = useState("Submit");

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
						try {
							await new Promise((resolve, reject) => {
								const formData = new FormData();
								formData.append("userId", auth?.userId);
								formData.append("username", auth?.username);
								formData.append("userEmail", auth?.email);
								formData.append("onModel", onModel);
								formData.append("file", acceptedFiles[i]);
								formData.append("album", "all");

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
						} catch (err) {
							toast.error(err?.message || "Something went wrong during upload");
						} finally {
							toast.success("Files uploaded");
						}
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
