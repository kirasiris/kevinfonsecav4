"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { DropdownButton, NavDropdown } from "react-bootstrap";
import DeleteModal from "@/components/global/deletemodal";
import { calculateTimeSincePublished } from "@/helpers/utilities";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
// import SingleCardHeader from "./postdata/header";
import Audio from "./audio";
import Map from "./map";
import Text from "./text";
import File from "./file";
import Photo from "./photo";
import Video from "./video";
import Default from "./default";
import ParseHtml from "@/layout/parseHtml";

const Post = ({
	auth = {},
	object = {},
	handleDraft,
	handlePublish,
	handleTrash,
	handleSchedule,
	handleDelete,
	handleFeature,
	handleUnfeature,
	handleHide,
	handleUnhide,
	handleCommented,
	handleUncommented,
	objects,
	setObjects,
	setTotalResults,
}) => {
	const images = ["https://source.unsplash.com/random/1200x900"];

	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id} mb-3`}>
				<div className="card">
					{/* <SingleCardHeader object={object} /> */}
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
								left: "66px",
								bottom: "455px",
							}}
						>
							<small className="me-1">
								{calculateTimeSincePublished(object?.createdAt)}
							</small>
						</div>
						{auth?.id === object?.user?._id && (
							<div className="float-end">
								<DropdownButton title="" variant="secondary" size="sm">
									<button className="dropdown-item btn btn-sm">
										Edit post
									</button>
									{!object?.featured && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleFeature(object._id)}
										>
											Feature post
										</button>
									)}
									{object?.featured && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUnfeature(object._id)}
										>
											Unfeature post
										</button>
									)}
									{!object?.hidden && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleHide(object._id)}
										>
											Hide post
										</button>
									)}
									{object?.hidden && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUnhide(object._id)}
										>
											Unhide post
										</button>
									)}
									{!object?.commented && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleCommented(object._id)}
										>
											Enable comments
										</button>
									)}
									{object?.commented && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUncommented(object._id)}
										>
											Disable comments
										</button>
									)}
									<NavDropdown.Divider />
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
						)}
					</div>
					<div
						className={`card-body ${
							(object?.files?.length >= 1 || images?.length >= 1) && `p-0`
						}`}
					>
						{object.subType === "audios" ? (
							<Audio object={object} />
						) : object.subType === "files" ? (
							<File object={object} />
						) : object.subType === "maps" ? (
							<>
								{/* <Text object={object} /> */}
								<ParseHtml text={object.text} classList="p-1" />
								<Map object={object} />
							</>
						) : object.subType === "photos" ? (
							<Photo object={object} />
						) : object.subType === undefined ? (
							<Default object={object} />
						) : object.subType === "text" ? (
							<Text object={object} />
						) : object.subType === "videos" ? (
							<Video object={object} />
						) : (
							<Default object={object} />
						)}
					</div>
					<div className="card-footer">
						<div className="float-end">
							<ExportModal object={object} />
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Post;
