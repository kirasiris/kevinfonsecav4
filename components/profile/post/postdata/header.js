"use client";
import DeleteModal from "@/components/global/deletemodal";
import { calculateTimeSincePublished } from "@/helpers/utilities";
import Image from "next/image";
import Link from "next/link";
import { DropdownButton, NavDropdown } from "react-bootstrap";

const SingleCardHeader = ({
	object = {},
	handleDraft,
	handlePublish,
	handleTrash,
	handleSchedule,
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	return (
		<div className="card-header">
			<div className="float-start">
				<Link
					href={{
						pathname: `/profile/${object.user._id}/${object.user.username}`,
						query: {
							page: 1,
							limit: 100,
							sort: "-createdAt",
						},
					}}
					passHref
					legacyBehavior
				>
					<a>
						<Image
							src={object.user.files.avatar.location.secure_location}
							className="rounded-5 me-3"
							width={35}
							height={35}
							alt={`${object.user.username}'s avatar`}
							style={{
								objectFit: "cover",
							}}
						/>
					</a>
				</Link>
			</div>
			<Link
				href={{
					pathname: `/profile/${object.user._id}/${object.user.username}`,
					query: {
						page: 1,
						limit: 100,
						sort: "-createdAt",
					},
				}}
				passHref
				legacyBehavior
			>
				<a>{object?.user?.username}</a>
			</Link>
			<div
				style={{
					position: "absolute",
					left: "70px",
				}}
			>
				<small className="me-1">
					{calculateTimeSincePublished(object?.createdAt)}
				</small>
			</div>
			<div className="float-end">
				<DropdownButton title="" variant="secondary" size="sm">
					<button className="dropdown-item btn btn-sm">Edit post</button>
					<button className="dropdown-item btn btn-sm">Feature post</button>
					<button className="dropdown-item btn btn-sm">Disable comments</button>
					<NavDropdown.Divider />
					<DeleteModal
						id={object?._id}
						action={handleDelete}
						classStr={`dropdown-item`}
						objects={objects}
						setObjects={setObjects}
						setTotalResults={setTotalResults}
					/>
				</DropdownButton>
			</div>
		</div>
	);
};
export default SingleCardHeader;
