"use client";
import Image from "next/image";
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
								pathname: `/noadmin/realstates/update/${object._id}`,
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
				<div className="blog-type-list__blog-thumbnail-wrapper has-image d-none d-md-block d-lg-block d-xl-block d-xxl-block">
					<Link
						href={{
							pathname: `/noadmin/realstates/update/${object._id}`,
							query: {},
						}}
						className="blog-type-list__blog-thumbnail-link"
					>
						<Image
							src={
								object.files?.avatar?.location.secure_location ||
								`https://source.unsplash.com/random/83x63`
							}
							className="blog-type-list__blog-thumbnail"
							alt="Blog titles image"
							width="83"
							height="63"
						/>
					</Link>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/noadmin/realstates/read/${object._id}`,
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
