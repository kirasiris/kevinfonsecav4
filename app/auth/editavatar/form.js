"use client";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";
import axios from "axios";

const Form = ({ auth = {} }) => {
	const [avatarData, setAvatarData] = useState({
		file: null,
		filename: `Choose file`,
		fileurl:
			auth?.data?.files?.avatar?.location?.secure_location ||
			`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
	});

	const { file, filename, fileurl } = avatarData;

	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	const upgradeAvatar = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			const token = await getAuthTokenOnServer();
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/uploads/uploadobject`,
				{
					userId: auth?.data?._id,
					username: auth?.data?.username,
					userEmail: auth?.data?.email,
					onModel: "User",
					file: file,
					album: "profile-avatars",
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

			await fetchurl(`/auth/updateavatar`, "PUT", "no-cache", {
				avatar: res.data.data._id,
			});
			resetForm();
			toast.success("Avatar uploaded");
			setBtnTxt(btnText);
		} catch (err) {
			console.log(err);
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
		setAvatarData({
			file: null,
			filename: `Choose file`,
			fileurl:
				auth?.data?.files?.avatar?.location?.secure_location ||
				`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
		});
	};

	return (
		<div className="card-body">
			<div className="align-content-center d-flex justify-content-center mb-3">
				<Image
					src={fileurl}
					alt="xD"
					width={150}
					height={150}
					style={{
						width: `150px`,
						height: `150px`,
						objectFit: "cover",
					}}
					priority={true}
					className="img-thumbnail rounded-circle"
				/>
			</div>
			<form onSubmit={upgradeAvatar}>
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
						setAvatarData({
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

export default Form;
