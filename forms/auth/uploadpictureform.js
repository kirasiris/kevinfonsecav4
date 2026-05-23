"use client";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import Webcam from "react-webcam";
import { base64toBlob } from "befree-utilities";
import UseProgress from "@/components/global/useprogress";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";

const videoConstraints = {
	facingMode: "user",
};

const UploadPictureForm = ({ auth = {} }) => {
	const fileurl =
		auth?.data?.files?.avatar?.location?.secure_location ||
		`https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg`;
	const [uploadPercentage, setUploadPercentage] = useState(0);
	const [cameraModal, setCameraModal] = useState(false);
	const [btnText, setBtnText] = useState("Submit");

	const webcamRef = useRef(null);

	const upgradeAvatar = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);
		const token = await getAuthTokenOnServer();
		const src = webcamRef.current.getScreenshot();
		const blob = base64toBlob(src);
		try {
			const res = await new Promise((resolve, reject) => {
				const formData = new FormData();
				formData.append("userId", auth?.userId);
				formData.append("username", auth?.username);
				formData.append("userEmail", auth?.email);
				formData.append("onModel", "User");
				formData.append("file", blob.file);
				formData.append("album", "profile-avatars");

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
				`/auth/updateavatar`,
				"PUT",
				"no-cache",
				{
					avatar: res?.data?._id,
				},
				undefined,
				false,
				false,
			);
		} catch (err) {
			toast.error(err?.message || "Something went wrong during upload");
		} finally {
			// resetForm();
			setUploadPercentage(0);
			toast.success("Avatar uploaded");
			setBtnText(btnText);
			setCameraModal(false);
		}
	};

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
