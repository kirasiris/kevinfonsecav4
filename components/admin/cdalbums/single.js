"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleFeature = () => {},
	handleUnfeature = () => {},
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
								pathname: `/noadmin/cdalbums/update/${object._id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.title}({object.onairtype.toUpperCase()})
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							{formatDateWithoutTime(object.createdAt)}
						</span>
						<span className="badge bg-dark me-1">{object.status}</span>
						{object.featured && (
							<span className="badge bg-dark me-1">featured</span>
						)}
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/noadmin/cdalbums/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								View&nbsp;It
							</Link>
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
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleFeature(object._id)}
							>
								Feature&nbsp;It
							</button>
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleUnfeature(object._id)}
							>
								Unfeature&nbsp;It
							</button>
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
		</li>
	);
};

export default Single;
