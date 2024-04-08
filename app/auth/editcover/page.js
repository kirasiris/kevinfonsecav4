"use client";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";
import axios from "axios";
import Link from "next/link";

const UpdateCover = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [coverData, setCoverData] = useState({
		file: null,
		filename: `Choose file`,
		fileurl: `https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
	});

	const { file, filename, fileurl } = coverData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [error, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setCoverData({
					...coverData,
					filename: res?.data?.files?.cover?.location?.filename,
					fileurl: res?.data?.files?.cover?.location?.secure_location,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(true);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
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
		fetchUser();
	}, [loading]);

	const upgradeCover = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			const token = await getAuthTokenOnServer();
			const res = await axios.put(
				`http://localhost:5000/api/v1/uploads/uploadobject`,
				{
					userId: auth?.user?._id,
					username: auth?.user?.username,
					userEmail: auth?.user?.email,
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
			// resetForm();
			toast.success("Cover uploaded");
			setBtnTxt(btnText);
			router.push(`/auth/profile`);
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
		setCoverData({
			file: null,
			filename: `Choose file`,
			fileurl: `https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
		});
	};

	return loading || profile === null || profile === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							<div className="float-start">
								<p className="m-1">Edit&nbsp;Cover</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link href="/auth/uploadpicture" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Take a picture</a>
									</Link>
									<Link href="/auth/editavatar" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Update avatar</a>
									</Link>
								</div>
							</div>
						</div>
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
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
								>
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
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateCover;
