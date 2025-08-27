"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";
import Waveform from "@/layout/waveform";

const Single = ({
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/cdalbums/song/${object._id}/update`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.title}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							{formatDateWithoutTime(object.createdAt)}
						</span>
						<span className="badge bg-dark me-1">{object.status}</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleDraft(object._id)}
							>
								Draft&nbsp;It
							</button>
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handlePublish(object._id)}
							>
								Publish&nbsp;It
							</button>
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleTrash(object._id)}
							>
								Trash&nbsp;It
							</button>
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleSchedule(object._id)}
							>
								Schedule&nbsp;It
							</button>
							<hr />
							<Link
								href={{
									pathname: `/noadmin/comments/create`,
									query: {
										resourceId: object._id,
										onModel: `Song`,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								Add&nbsp;Comment
							</Link>
							<Link
								href={{
									pathname: `/noadmin/reports/create`,
									query: {
										resourceId: object._id,
										onModel: `Song`,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								Add&nbsp;Report
							</Link>
							<hr />
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={objects}
								setObjects={setObjects}
								setTotalResults={setTotalResults}
							/>
						</DropdownButton>
					</span>
				</div>
			</div>
			<Waveform
				id={object?._id}
				src={object?.files?.audio_url?.location?.secure_location}
				mediaTitle={object?.title}
				mediaAuthor={object?.resourceId?.title}
				mediaAlbum={object?.resourceId?.title}
			/>
		</li>
	);
};

export default Single;
