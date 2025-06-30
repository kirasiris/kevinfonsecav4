"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
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
	const [, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	const upgradeCover = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			const token = await getAuthTokenOnServer();
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
				{
					userId: auth?.data?._id,
					username: auth?.data?.username,
					userEmail: auth?.data?.email,
					onModel: "User",
					file: file,
					album: "profile-covers",
				},
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token.value}`,
					},
					onUploadProgress: (ProgressEvent) => {
						setUploadPercentage(
							parseInt(
								Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total
							)
						);
						setTimeout(() => setUploadPercentage(0), 10000);
					},
				}
			);
			await fetchurl(`/auth/updatecover`, "PUT", "no-cache", {
				cover: res.data.data._id,
			});
			resetForm();
			toast.success("Cover uploaded");
			setBtnTxt(btnText);
		} catch (err) {
			console.log(err);
			setBtnTxt(btnText);
			setError(true);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
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
					placeholder={fileurl}
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
