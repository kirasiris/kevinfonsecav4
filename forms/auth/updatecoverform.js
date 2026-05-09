"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import UseProgress from "@/components/global/useprogress";

const UpdateCoverForm = ({ auth = {} }) => {
	const [coverData, setCoverData] = useState({
		file: null,
		filename: `Choose file`,
		fileurl:
			auth?.data?.files?.cover?.location?.secure_location ||
			`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
	});

	const { file, filename, fileurl } = coverData;

	const [uploadPercentage, setUploadPercentage] = useState(0);

	const [btnText, setBtnText] = useState("Submit");

	const upgradeCover = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);
		const token = await getAuthTokenOnServer();
		try {
			const res = await new Promise((resolve, reject) => {
				const formData = new FormData();
				formData.append("userId", auth?.data?._id);
				formData.append("username", auth?.data?.username);
				formData.append("userEmail", auth?.data?.email);
				formData.append("onModel", "User");
				formData.append("file", file);
				formData.append("album", "profile-covers");

				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (event) => {
					if (event.lengthComputable) {
						setUploadPercentage(Math.round((event.loaded * 100) / event.total));
						setTimeout(() => setUploadPercentage(0), 10000);
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						const parsed = JSON.parse(xhr.responseText);
						resolve(parsed);
						setCoverData({
							file: file,
							filename: parsed.data.location.filename,
							fileurl: parsed.data.location.secure_location,
						});
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
				`/auth/updatecover`,
				"PUT",
				"no-cache",
				{
					cover: res?.data?._id,
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
			toast.success("Cover uploaded");
			setBtnText(btnText);
		}
	};

	const resetForm = () => {
		setCoverData({
			file: null,
			filename: `Choose file`,
			fileurl:
				auth?.data?.files?.cover?.location?.secure_location ||
				`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
		});
	};

	return (
		<div className="card-body">
			<div className="align-content-center d-flex justify-content-center mb-3">
				<Image
					src={fileurl}
					alt="xD"
					width={813}
					height={457}
					style={{
						width: `813px`,
						height: `457px`,
						objectFit: "cover",
					}}
					priority={true}
					className="img-thumbnail"
				/>
			</div>
			<form onSubmit={upgradeCover}>
				<label htmlFor="cover" className="form-label">
					File
				</label>
				<input
					id="cover"
					name="file"
					label={file}
					onChange={(e) => {
						const myFile = e.target.files[0];
						let preview = "";
						if (myFile instanceof Blob || myFile instanceof File) {
							preview = URL.createObjectURL(myFile);
						}
						setCoverData({
							file: myFile,
							filename: myFile.name,
							fileurl: preview,
						});
					}}
					type="file"
					className="form-control mb-3"
					placeholder={fileurl || filename}
					accept={`image/*`}
				/>
				<UseProgress percentage={uploadPercentage} />
				<button type="submit" className="btn btn-secondary btn-sm float-start">
					{btnText}
				</button>
				<button
					type="button"
					className="btn btn-secondary btn-sm float-end"
					onClick={resetForm}
				>
					Reset
				</button>
			</form>
		</div>
	);
};

export default UpdateCoverForm;
