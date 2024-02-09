"use client";
import Image from "next/image";
import Link from "next/link";
import { FaFilePdf, FaFileVideo } from "react-icons/fa";
import DeleteModal from "@/components/global/deletemodal";

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
			<div className="col-auto mb-3 text-center">
				<figure
					title={object.title}
					onClick={() => {
						setObjects({
							...objects,
							selected: object,
							showMediaModal: false,
						});
					}}
				>
					<Image
						src={
							object?.location?.secure_location ||
							`https://source.unsplash.com/random/184x184`
						}
						alt={object.title}
						width={`184`}
						height={`184`}
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
					<DeleteModal
						id={object._id ? object._id : object._id}
						action={handleDelete}
						objects={objects}
						setObjects={setObjects}
						setTotalResults={setTotalResults}
					/>
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
			<div className="col-auto mb-3 text-center">
				<figure
					title={object.title}
					onClick={() => {
						setObjects({
							...objects,
							selected: object,
							showMediaModal: false,
						});
					}}
				>
					<FaFilePdf style={{ fontSize: "184px" }} />
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
					<DeleteModal
						id={object._id ? object._id : object._id}
						action={handleDelete}
						objects={objects}
						setObjects={setObjects}
						setTotalResults={setTotalResults}
					/>
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
			<div className="col-auto mb-3 text-center">
				<figure
					title={object.title}
					onClick={() => {
						setObjects({
							...objects,
							selected: object,
							showMediaModal: false,
						});
					}}
				>
					<FaFileVideo style={{ fontSize: "184px" }} />
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
					<DeleteModal
						id={object._id ? object._id : object._id}
						action={handleDelete}
						objects={objects}
						setObjects={setObjects}
						setTotalResults={setTotalResults}
					/>
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
