import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect, notFound } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import Image from "next/image";
// import Plyr from "plyr";
import FormButtons from "@/components/global/formbuttons";

async function getFile(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateFile = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const file = await getFile(`/${awtdParams.id}`);

	const upgradeFile = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			caption: formData.get("caption"),
			altText: formData.get("altText"),
			text: formData.get("text"),
		};

		await fetchurl(`/files/${awtdParams.id}`, "PUT", "no-cache", rawFormData);
		redirect("/noadmin/files");
	};

	/*
	 *
	 * IMAGE OBJECT
	 *
	 */
	const imgObj = ({ file }) => {
		return (
			<figure title={file?.data?.title}>
				<Image
					src={
						file?.data?.location?.secure_location ||
						`https://source.unsplash.com/random/188x188`
					}
					alt={file.title}
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

	const pdfObj = ({ file }) => {
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

	const vidObj = ({ file }) => {
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

	return (
		<form className="row" action={upgradeFile}>
			<div className="col">
				{file?.data?.format_type === "image" && imgObj({ file })}
				{file?.data?.format_type === "application" && pdfObj({ file })}
				{file?.data?.format_type === "video" && vidObj({ file })}
			</div>
			<div className="col">
				<label htmlFor="file-title" className="form-label">
					Title
				</label>
				<input
					id="file-title"
					name="title"
					defaultValue={file?.data?.title}
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
					defaultValue={file?.data?.caption}
				/>
				<label htmlFor="file-alt-text" className="form-label">
					Alt text
				</label>
				<input
					id="file-alt-text"
					name="altText"
					defaultValue={file?.data?.altText}
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
					defaultValue={file?.data?.text}
				/>
				<label htmlFor="file-url" className="form-label">
					URL
				</label>
				<input
					id="file-url"
					name="url"
					defaultValue={file?.data?.location?.secure_location}
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
							defaultValue={file?.data?.location?.filename}
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
								file?.data?.dimensions?.width +
								"x" +
								file?.data?.dimensions?.height
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
							defaultValue={file?.data?.format.toUpperCase()}
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
							defaultValue={file?.data?.createdAt}
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

export default UpdateFile;
