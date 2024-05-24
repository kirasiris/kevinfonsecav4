// "use client";
// import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
// import { useRouter } from "next/navigation";
// import { useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import AuthContext from "@/helpers/globalContext";
// import Sidebar from "@/layout/auth/sidebar";
// import Globalcontent from "@/layout/content";
// import Image from "next/image";
// import UseProgress from "@/components/global/useprogress";
// import axios from "axios";
// import Link from "next/link";

// const UpdateAvatar = ({ params, searchParams }) => {
// 	const { auth } = useContext(AuthContext);
// 	const router = useRouter();

// 	// Redirec if not authenticated
// 	!auth.isAuthenticated && router.push("/auth/login");

// 	const [avatarData, setAvatarData] = useState({
// 		file: null,
// 		filename: `Choose file`,
// 		fileurl: `https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
// 	});

// 	const { file, filename, fileurl } = avatarData;

// 	const [profile, setProfile] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [uploadPercentage, setUploadPercentage] = useState(0);
// 	const [error, setError] = useState(false);
// 	const [btnText, setBtnTxt] = useState("Submit");

// 	useEffect(() => {
// 		const fetchUser = async () => {
// 			try {
// 				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
// 				setProfile(res?.data);
// 				setAvatarData({
// 					...avatarData,
// 					filename: res?.data?.files?.avatar?.location?.filename,
// 					fileurl: res?.data?.files?.avatar?.location?.secure_location,
// 				});
// 				setLoading(false);
// 			} catch (err) {
// 				console.log(err);
// 				setError(true);
// 				// const error = err.response.data.message;
// 				const error = err?.response?.data?.error?.errors;
// 				const errors = err?.response?.data?.errors;

// 				if (error) {
// 					// dispatch(setAlert(error, 'danger'));
// 					error &&
// 						Object.entries(error).map(([, value]) =>
// 							toast.error(value.message)
// 						);
// 				}

// 				if (errors) {
// 					errors.forEach((error) => toast.error(error.msg));
// 				}

// 				toast.error(err?.response?.statusText);
// 				return {
// 					msg: err?.response?.statusText,
// 					status: err?.response?.status,
// 				};
// 			}
// 		};
// 		fetchUser();
// 	}, [loading]);

// 	const upgradeAvatar = async (e) => {
// 		e.preventDefault();
// 		try {
// 			setBtnTxt("Submit...");
// 			const token = await getAuthTokenOnServer();
// 			const res = await axios.put(
// 				`http://localhost:5000/api/v1/uploads/uploadobject`,
// 				{
// 					userId: auth?.user?._id,
// 					username: auth?.user?.username,
// 					userEmail: auth?.user?.email,
// 					onModel: "User",
// 					file: file,
// 					album: "profile-avatars",
// 				},
// 				{
// 					headers: {
// 						"Content-Type": "multipart/form-data",
// 						Authorization: `Bearer ${token.value}`,
// 					},
// 					onUploadProgress: (ProgressEvent) => {
// 						setUploadPercentage(
// 							parseInt(
// 								Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total
// 							)
// 						);
// 						setTimeout(() => setUploadPercentage(0), 10000);
// 					},
// 				}
// 			);
// 			await fetchurl(`/auth/updateavatar`, "PUT", "no-cache", {
// 				avatar: res.data.data._id,
// 			});
// 			// resetForm()
// 			toast.success("Avatar uploaded");
// 			setBtnTxt(btnText);
// 			router.push(`/auth/profile`);
// 		} catch (err) {
// 			console.log(err);
// 			setError(true);
// 			// const error = err.response.data.message;
// 			const error = err?.response?.data?.error?.errors;
// 			const errors = err?.response?.data?.errors;

// 			if (error) {
// 				// dispatch(setAlert(error, 'danger'));
// 				error &&
// 					Object.entries(error).map(([, value]) => toast.error(value.message));
// 			}

// 			if (errors) {
// 				errors.forEach((error) => toast.error(error.msg));
// 			}

// 			toast.error(err?.response?.statusText);
// 			return {
// 				msg: err?.response?.statusText,
// 				status: err?.response?.status,
// 			};
// 		}
// 	};

// 	const resetForm = () => {
// 		setAvatarData({
// 			file: null,
// 			filename: `Choose file`,
// 			fileurl: `https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`,
// 		});
// 	};

// 	return loading || profile === null || profile === undefined ? (
// 		error ? (
// 			<>Not found</>
// 		) : (
// 			<>Loading...</>
// 		)
// 	) : (
// 		<div className="container my-4">
// 			<div className="row">
// 				<Sidebar />
// 				<Globalcontent>
// 					<div className="card">
// 						<div className="card-header">
// 							<div className="float-start">
// 								<p className="m-1">Edit&nbsp;Avatar</p>
// 							</div>
// 							<div className="float-end">
// 								<div className="btn-group">
// 									<Link href="/auth/uploadpicture" passHref legacyBehavior>
// 										<a className="btn btn-secondary btn-sm">Take a picture</a>
// 									</Link>
// 									<Link href="/auth/editcover" passHref legacyBehavior>
// 										<a className="btn btn-secondary btn-sm">Update cover</a>
// 									</Link>
// 								</div>
// 							</div>
// 						</div>
// 						<div className="card-body">
// 							<div className="align-content-center d-flex justify-content-center mb-3">
// 								<Image
// 									src={fileurl}
// 									alt="xD"
// 									width={150}
// 									height={150}
// 									style={{
// 										width: "150px",
// 										height: "150px",
// 										objectFit: "cover",
// 									}}
// 									priority={true}
// 									className="img-thumbnail rounded-circle"
// 								/>
// 							</div>
// 							<form onSubmit={upgradeAvatar}>
// 								<label htmlFor="avatar" className="form-label">
// 									File
// 								</label>
// 								<input
// 									id="avatar"
// 									name="file"
// 									onChange={(e) => {
// 										const myFile = e.target.files[0];
// 										let preview = "";
// 										if (myFile instanceof Blob || myFile instanceof File) {
// 											preview = URL.createObjectURL(myFile);
// 										}
// 										setAvatarData({
// 											file: myFile,
// 											filename: myFile.name,
// 											fileurl: preview,
// 										});
// 									}}
// 									type="file"
// 									className="form-control mb-3"
// 									placeholder={fileurl}
// 									accept={`image/*`}
// 								/>
// 								<UseProgress percentage={uploadPercentage} />
// 								<button
// 									type="submit"
// 									className="btn btn-secondary btn-sm float-start"
// 								>
// 									{btnText}
// 								</button>
// 								<button
// 									type="button"
// 									className="btn btn-secondary btn-sm float-end"
// 									onClick={resetForm}
// 								>
// 									Reset
// 								</button>
// 							</form>
// 						</div>
// 					</div>
// 				</Globalcontent>
// 			</div>
// 		</div>
// 	);
// };

// export default UpdateAvatar;
// "use client";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Image from "next/image";
// import UseProgress from "@/components/global/useprogress";
// import axios from "axios";
import Link from "next/link";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function uploadFile(formData) {
	console.log(formData);

	const res = await fetchurl(
		`/uploads/uploadobject`,
		"PUT",
		"no-cache",
		formData,
		undefined,
		false,
		false
	);
	return res;
}

const UpdateAvatar = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	let fileurl =
		auth?.data?.files?.avatar?.location?.secure_location ||
		"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg";

	const upgradeAvatar = async (formData) => {
		"use server";
		const avatar = formData.get("file");
		const arrayBuffer = await avatar.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);

		const rawFormData = {
			userId: auth?.data?._id,
			username: auth?.data?.username,
			userEmail: auth?.data?.email,
			onModel: "User",
			album: "profile-avatars",
			file: buffer,
		};
		const token = await getAuthTokenOnServer();
		const res = await uploadFile(rawFormData);
		// console.log(res);
		// await fetchurl(`/auth/updateavatar`, "PUT", "no-cache", {
		// 	avatar: res.data.data._id,
		// });
		//redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							<div className="float-start">
								<p className="m-1">Edit&nbsp;Avatar</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link href="/auth/uploadpicture" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Take a picture</a>
									</Link>
									<Link href="/auth/editcover" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Update cover</a>
									</Link>
								</div>
							</div>
						</div>
						<div className="card-body">
							<div className="align-content-center d-flex justify-content-center mb-3">
								<Image
									src={fileurl}
									alt="xD"
									width={150}
									height={150}
									style={{
										width: "150px",
										height: "150px",
										objectFit: "cover",
									}}
									priority={true}
									className="img-thumbnail rounded-circle"
								/>
							</div>
							<form action={upgradeAvatar}>
								<label htmlFor="file" className="form-label">
									File
								</label>
								<input
									id="file"
									name="file"
									// onChange={(e) => {
									// 	const myFile = e.target.files[0];
									// 	let preview = "";
									// 	if (myFile instanceof Blob || myFile instanceof File) {
									// 		preview = URL.createObjectURL(myFile);
									// 	}
									// 	setAvatarData({
									// 		file: myFile,
									// 		filename: myFile.name,
									// 		fileurl: preview,
									// 	});
									// }}
									type="file"
									className="form-control mb-3"
									placeholder={fileurl}
									accept={`image/*`}
								/>
								{/* <UseProgress percentage={uploadPercentage} /> */}
								<FormButtons />
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateAvatar;
