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
			<div className="col mb-3">
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
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-secondary btn-sm">Read more</a>
					</Link>
					<button
						className="btn btn-danger btn-sm"
						onClick={() => handleDelete(object._id, object.location.public_id)}
						type="button"
					>
						Delete
					</button>
				</div>
			</div>
		);
	};

	/*
	 *
	 * PDF OBJECT
	 *
	 */

	const pdfObj = ({ object }) => {
		return (
			<div className="col mb-3">
				<figure title={object.title}>
					<FaFilePdf style={{ fontSize: "188px" }} />
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-secondary btn-sm">Read more</a>
					</Link>
					<button
						className="btn btn-danger btn-sm"
						onClick={() => handleDelete(object._id, object.location.public_id)}
						type="button"
					>
						Delete
					</button>
				</div>
			</div>
		);
	};
	/*
	 *
	 * VIDEO OBJECT
	 *
	 */
	const vidObj = ({ object }) => {
		return (
			<div className="col mb-3">
				<figure title={object.title}>
					<FaFileVideo style={{ fontSize: "188px" }} />
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-secondary btn-sm">Read more</a>
					</Link>
					<button
						className="btn btn-danger btn-sm"
						onClick={() => handleDelete(object._id, object.location.public_id)}
						type="button"
					>
						Delete
					</button>
				</div>
			</div>
		);
	};

	return (
		<>
			{object.format_type === "image" && imgObj({ object })}
			{object.format_type === "application" && pdfObj({ object })}
			{object.format_type === "video" && vidObj({ object })}
		</>
	);
};

export default Single;
