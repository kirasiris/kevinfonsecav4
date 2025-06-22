"use client";
import Image from "next/image";
import Link from "next/link";
import { FaFilePdf, FaFileVideo, FaFileAudio } from "react-icons/fa";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
	setSelectedObject = () => {},
	setShowMediaModel = () => {},
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
						setSelectedObject(object);
						setShowMediaModel(false);
					}}
				>
					<Image
						src={
							object?.location?.secure_location ||
							`https://source.unsplash.com/random/184x184`
						}
						alt={object.title}
						width={`250`}
						height={`200`}
					/>
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						className="btn btn-secondary btn-sm"
					>
						Read&nbsp;more
					</Link>
					<Link
						href={{
							pathname: `/noadmin/reports/create`,
							query: {
								resourceId: object._id,
								onModel: `File`,
							},
						}}
						className="btn btn-dark btn-sm"
					>
						Add&nbsp;Report
					</Link>
					<DeleteModal
						id={object._id ? object._id : object._id}
						sId={object?.location?.public_id}
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
						setSelectedObject(object);
						setShowMediaModel(false);
					}}
				>
					<FaFilePdf style={{ fontSize: "184px" }} />
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						className="btn btn-secondary btn-sm"
					>
						Read&nbsp;more
					</Link>
					<Link
						href={{
							pathname: `/noadmin/reports/create`,
							query: {
								resourceId: object._id,
								onModel: `File`,
							},
						}}
						className="btn btn-dark btn-sm"
					>
						Add&nbsp;Report
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
						setSelectedObject(object);
						setShowMediaModel(false);
					}}
				>
					<FaFileVideo style={{ fontSize: "184px" }} />
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						className="btn btn-secondary btn-sm"
					>
						Read&nbsp;more
					</Link>
					<Link
						href={{
							pathname: `/noadmin/reports/create`,
							query: {
								resourceId: object._id,
								onModel: `File`,
							},
						}}
						className="btn btn-dark btn-sm"
					>
						Add&nbsp;Report
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
	 * AUDIO OBJECT
	 *
	 */
	const audObj = ({ object }) => {
		return (
			<div className="col-auto mb-3 text-center">
				<figure
					title={object.title}
					onClick={() => {
						setSelectedObject(object);
						setShowMediaModel(false);
					}}
				>
					<FaFileAudio style={{ fontSize: "184px" }} />
				</figure>
				<div className="btn-group">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object._id}`,
						}}
						className="btn btn-secondary btn-sm"
					>
						Read&nbsp;more
					</Link>
					<Link
						href={{
							pathname: `/noadmin/reports/create`,
							query: {
								resourceId: object._id,
								onModel: `File`,
							},
						}}
						className="btn btn-dark btn-sm"
					>
						Add&nbsp;Report
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
			{object.format_type === "audio" && audObj({ object })}
		</>
	);
};

export default Single;
