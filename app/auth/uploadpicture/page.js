"use client";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Image from "next/image";
import UseProgress from "@/components/global/useprogress";
import axios from "axios";
import Link from "next/link";
import { Modal } from "react-bootstrap";
import Webcam from "react-webcam";
import { b64toBlob } from "@/helpers/utilities";

const videoConstraints = {
	facingMode: "user",
};

const UploadPicture = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const fileurl = `https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`;
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [cameraModal, setCameraModal] = useState(false);
	const [error, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
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

	const webcamRef = useRef(null);

	const upgradeAvatar = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				const src = webcamRef.current.getScreenshot();
				const blob = b64toBlob(src);
				setBtnTxt("Submit...");
				const token = await getAuthTokenOnServer();
				const res = await axios.put(
					`http://localhost:5000/api/v1/uploads/uploadobject`,
					{
						userId: auth?.user?._id,
						username: auth?.user?.username,
						userEmail: auth?.user?.email,
						onModel: "User",
						file: blob.file,
						album: "profile-avatars",
					},
					{
						// method: "PUT",
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
				// resetForm();
				toast.success("Avatar uploaded");
				setBtnTxt(btnText);
				setCameraModal(false);
				router.push("/auth/profile");
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
		},
		[webcamRef]
	);

	const resetForm = () => {};

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
								<p className="m-1">Take&nbsp;a&nbsp;Picture</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link href="/auth/editavatar" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Update avatar</a>
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
									src={
										profile.files?.avatar?.location?.secure_location || fileurl
									}
									alt="xD"
									width="150"
									height="150"
									style={{
										width: "150px",
										height: "150px",
										objectFit: "cover",
									}}
									priority={true}
									className="img-thumbnail rounded-circle"
								/>
							</div>
							<button
								className="btn btn-secondary btn-sm w-100"
								type="button"
								onClick={() => setCameraModal(!cameraModal)}
							>
								Open camera
							</button>
						</div>
					</div>
				</Globalcontent>
			</div>
			<Modal
				show={cameraModal}
				onHide={() => setCameraModal(!cameraModal)}
				size="xl"
				backdrop={false}
				animation={true}
			>
				<Modal.Header>
					<Modal.Title>Smile!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Webcam
						audio={true}
						// audioConstraints={}
						forceScreenshotSourceSize={true}
						imageSmoothing={true}
						mirrored={false}
						minScreenshotHeight={550}
						minScreenshotWidth={550}
						// onUserMedia={}
						// onUserMediaError={}
						screenshotFormat={"image/jpeg"}
						screenshotQuality={1}
						videoConstraints={videoConstraints}
						style={{ maxWidth: "100%", width: "100%" }}
						ref={webcamRef}
					/>
					<hr />
					<UseProgress percentage={uploadPercentage} />
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setCameraModal(!cameraModal)}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="submit"
						onClick={upgradeAvatar}
					>
						{btnText}
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default UploadPicture;
