"use client";
import Image from "next/image";
import Link from "next/link";
import { FaFilePdf, FaFileVideo } from "react-icons/fa";

const Single = ({
	object = {},
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	/*
	 *
	 * IMAGE OBJECT
	 *
	 */
	const imgObj = ({ object }) => {
		return (
			<figure title={object.title}>
				<Image
					src={
						object?.location?.secure_location ||
						`https://source.unsplash.com/random/188x188`
					}
					alt={object.title}
					width={`188`}
					height={`188`}
					onClick={() => {
						setObjects({
							...objects,
							selected: object,
							showMediaModal: false,
						});
					}}
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
		return <FaFilePdf />;
	};
	/*
	 *
	 * VIDEO OBJECT
	 *
	 */
	const vidObj = () => {
		return <FaFileVideo />;
	};

	return (
		<Link
			href={{
				pathname: `/noadmin/files/update/${object._id}`,
			}}
			passHref
			legacyBehavior
		>
			<a className="blog-gallery-item col">
				{object.format_type === "image" && imgObj({ object })}
				{object.format_type === "application" && pdfObj()}
				{object.format_type === "video" && vidObj()}
				{/* <button
										className="btn btn-danger btn-sm"
										onClick={() =>
											handleDelete(object._id, object.location.public_id)
										}
										type="button"
									>
										Delete
									</button> */}
			</a>
		</Link>
	);
};

export default Single;
