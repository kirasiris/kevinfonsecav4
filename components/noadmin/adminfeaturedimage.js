"use client";
import Image from "next/image";
import { FaFilePdf, FaFileVideo } from "react-icons/fa";

const AdminFeaturedImage = ({ avatar = "", avatarFormat = "image" }) => {
	/*
	 *
	 * ANY OBJECT
	 *
	 */
	const anyObj = () => {
		return (
			<figure>
				<Image
					src={
						avatar?.location?.secure_location ||
						"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
					}
					alt="xD"
					width={`558`}
					height={`558`}
					style={{ maxWidth: "1920px", maxHeight: "1920px" }}
					priority={true}
				/>
			</figure>
		);
	};
	/*
	 *
	 * IMAGE OBJECT
	 *
	 */
	const imgObj = () => {
		return (
			<figure>
				<Image
					src={
						avatar?.location?.secure_location ||
						"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
					}
					alt="xD"
					width={`558`}
					height={`558`}
					style={{ maxWidth: "1920px", maxHeight: "1920px" }}
					priority={true}
				/>
			</figure>
		);
	};
	/*
	 *
	 * PDF OBJECT
	 *
	 */
	const pdfObj = () => {
		return (
			<figure>
				<FaFilePdf style={{ fontSize: "184px" }} />
			</figure>
		);
	};
	/*
	 *
	 * VIDEO OBJECT
	 *
	 */
	const vidObj = () => {
		return (
			<figure>
				<FaFileVideo style={{ fontSize: "184px" }} />
			</figure>
		);
	};
	/*
	 *
	 * AUDIO OBJECT
	 *
	 */
	const audObj = () => {
		return (
			<figure>
				{/* <FaFileAudio style={{ fontSize: "184px" }} /> */}
				<audio
					controls
					style={{
						width: "100%",
						backgroundColor: "#000000",
					}}
				>
					<source
						src={
							avatar?.location?.secure_location ||
							"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
						}
					/>
				</audio>
			</figure>
		);
	};
	return (
		<div className="d-grid gap-2">
			{avatarFormat === "any" && anyObj()}
			{avatarFormat === "image" && imgObj()}
			{avatarFormat === "application" && pdfObj()}
			{avatarFormat === "video" && vidObj()}
			{avatarFormat === "audio" && audObj()}
		</div>
	);
};

export default AdminFeaturedImage;
