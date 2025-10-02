"use client";
import { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Webcam from "react-webcam";
import { base64toBlob } from "befree-utilities";
import UseProgress from "@/components/global/useprogress";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";

const videoConstraints = {
	facingMode: "user",
};

const UploadPictureForm = ({ auth = {}, object = {} }) => {
	const fileurl =
		object.files?.nfa_avatar?.location?.secure_location ||
		`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`;
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [cameraModal, setCameraModal] = useState(false);
	const [, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	const webcamRef = useRef(null);

	const upgradeAvatar = useCallback(
		async (e) => {
			e.preventDefault();
			try {
				const src = webcamRef.current.getScreenshot();
				const blob = base64toBlob(src);
				setBtnTxt("Submit...");
				const token = await getAuthTokenOnServer();
				const res = await axios.put(
					`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
					{
						userId: object?._id,
						username: object?.username,
						userEmail: object?.email,
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
				await fetchurl(
					`/noadmin/users/${object?._id}/updatenfaavatar`,
					"PUT",
					"no-cache",
					{
						nfa_avatar: res.data.data._id,
					}
				);
				// resetForm();
				toast.success("NFA Avatar uploaded");
				setBtnTxt(btnText);
				setCameraModal(false);
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

	return (
		<>
			<div className="card-body">
				<div className="align-content-center d-flex justify-content-center mb-3">
					<Image
						src={fileurl}
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
		</>
	);
};

export default UploadPictureForm;
