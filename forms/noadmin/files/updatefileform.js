"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
// import Plyr from "plyr";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateFileForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeFile = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			caption: formData.get("caption"),
			altText: formData.get("altText"),
			text: formData.get("text"),
		};

		const res = await fetchurl(
			`/noadmin/files/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
		);

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`File updated`, "bottom");
		router.push(`/noadmin/files`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	/*
	 *
	 * IMAGE OBJECT
	 *
	 */
	const imgObj = (file = {}) => {
		return (
			<figure title={file?.data?.title}>
				<Image
					src={
						file?.data?.location?.secure_location ||
						`https://source.unsplash.com/random/188x188`
					}
					alt={file?.data?.title || "No alt text"}
					width={`1200`}
					height={`900`}
				/>
			</figure>
		);
	};

	/*
	 *
	 * PDF OBJECT
	 *
	 */

	const pdfObj = (file = {}) => {
		return (
			<object
				data={file?.data?.location?.secure_location}
				type={`${file?.data?.format_type}/${file?.data?.format}`}
				width="100%"
				height="100%"
			>
				<p>
					Alternative text - include a link{" "}
					<a href={file?.data?.location?.secure_location}>to the PDF!</a>
				</p>
			</object>
		);
	};
	/*
	 *
	 * VIDEO OBJECT
	 *
	 */
	// const videoRef = useRef(null);

	// useEffect(() => {
	// 	const player = new Plyr(videoRef.current);
	// 	return () => {
	// 		player.destroy();
	// 	};
	// }, [fileId]);

	const vidObj = (file = {}) => {
		return (
			<video
				// ref={videoRef}
				title={file?.data?.title}
				controls
			>
				<source
					src={file?.data?.location?.secure_location}
					type={`${file?.data?.format_type}/${file?.data?.format}`}
				/>
			</video>
		);
	};

	const audObj = (file = {}) => {
		return (
			<audio
				title={file?.data?.title}
				controls
				style={{
					width: "100%",
					backgroundColor: "#000000",
				}}
			>
				<source
					src={file?.data?.location?.secure_location}
					type={`${file?.data?.format_type}/${file?.data?.format}`}
				/>
			</audio>
		);
	};

	return (
		<form className="row" onSubmit={upgradeFile}>
			<div className="col">
				{object?.data?.format_type === "image" && imgObj(object)}
				{object?.data?.format_type === "application" && pdfObj(object)}
				{object?.data?.format_type === "video" && vidObj(object)}
				{object?.data?.format_type === "audio" && audObj(object)}
			</div>
			<div className="col">
				<label htmlFor="file-title" className="form-label">
					Title
				</label>
				<input
					id="file-title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="file-caption" className="form-label">
					Caption
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="file-caption"
					name="caption"
					onModel="File"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={object?.data?.caption}
				/>
				<label htmlFor="file-alt-text" className="form-label">
					Alt text
				</label>
				<input
					id="file-alt-text"
					name="altText"
					defaultValue={object?.data?.altText}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					onModel="File"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={object?.data?.text}
				/>
				<label htmlFor="objectId" className="form-label">
					Object ID
				</label>
				<input
					id="objectId"
					name="objectId"
					defaultValue={object?.data?._id}
					type="text"
					className="form-control mb-3"
					placeholder=""
					readOnly
					disabled
				/>
				<label htmlFor="file-url" className="form-label">
					URL
				</label>
				<input
					id="file-url"
					name="url"
					defaultValue={object?.data?.location?.secure_location}
					type="text"
					className="form-control mb-3"
					placeholder=""
					readOnly
					disabled
				/>
				<div className="row gap-3">
					<div className="col">
						<label htmlFor="file-name" className="form-label">
							FILE NAME
						</label>
						<input
							id="file-name"
							name="file-name"
							defaultValue={object?.data?.location?.filename}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
							disabled
						/>
						<label htmlFor="file-dimensions" className="form-label">
							DIMENSIONS
						</label>
						<input
							id="file-dimensions"
							name=""
							defaultValue={
								object?.data?.dimensions?.width +
								"x" +
								object?.data?.dimensions?.height
							}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
							disabled
						/>
					</div>
					<div className="col">
						<label htmlFor="file-type" className="form-label">
							FILE TYPE
						</label>
						<input
							id="file-type"
							name=""
							defaultValue={object?.data?.format.toUpperCase()}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
							disabled
						/>
						<label htmlFor="file-uploadedAt" className="form-label">
							UPLOAD DATE
						</label>
						<input
							id="file-uploadedAt"
							name=""
							defaultValue={object?.data?.createdAt}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
							disabled
						/>
					</div>
				</div>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateFileForm;
