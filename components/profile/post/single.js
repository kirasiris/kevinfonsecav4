"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { DropdownButton, NavDropdown } from "react-bootstrap";
import { calculateTimeSincePublished } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
import Audio from "./audio";
import Map from "./map";
import Text from "./text";
import File from "./file";
import Photo from "./photo";
import Video from "./video";
import Default from "./default";
import ParseHtml from "@/layout/parseHtml";
import ErrorPage from "@/layout/errorpage";

const Post = ({
	auth = {},
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleFeature = () => {},
	handleUnfeature = () => {},
	handleHide = () => {},
	handleUnhide = () => {},
	handleCommented = () => {},
	handleUncommented = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	if (
		typeof handleDraft !== "function" &&
		handleDraft !== "" &&
		handleDraft !== undefined &&
		handleDraft !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDraft parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handlePublish !== "function" &&
		handlePublish !== "" &&
		handlePublish !== undefined &&
		handlePublish !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handlePublish parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleTrash !== "function" &&
		handleTrash !== "" &&
		handleTrash !== undefined &&
		handleTrash !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleTrash parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleSchedule !== "function" &&
		handleSchedule !== "" &&
		handleSchedule !== undefined &&
		handleSchedule !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleSchedule parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleDelete !== "function" &&
		handleDelete !== "" &&
		handleDelete !== undefined &&
		handleDelete !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDelete parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleFeature !== "function" &&
		handleFeature !== "" &&
		handleFeature !== undefined &&
		handleFeature !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleFeature parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleUnfeature !== "function" &&
		handleUnfeature !== "" &&
		handleUnfeature !== undefined &&
		handleUnfeature !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleUnfeature parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleHide !== "function" &&
		handleHide !== "" &&
		handleHide !== undefined &&
		handleHide !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleHide parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleUnhide !== "function" &&
		handleUnhide !== "" &&
		handleUnhide !== undefined &&
		handleUnhide !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleUnhide parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleCommented !== "function" &&
		handleCommented !== "" &&
		handleCommented !== undefined &&
		handleCommented !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleCommented parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleUncommented !== "function" &&
		handleUncommented !== "" &&
		handleUncommented !== undefined &&
		handleUncommented !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleUncommented parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof setObjects !== "function" &&
		setObjects !== "" &&
		setObjects !== undefined &&
		setObjects !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The setObjects parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof setTotalResults !== "function" &&
		setTotalResults !== "" &&
		setTotalResults !== undefined &&
		setTotalResults !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The setTotalResults parameter is not a function!. Please try again"
				}
			/>
		);
	}

	const images = ["https://source.unsplash.com/random/1200x900"];

	return (
		<Suspense fallback={<Loading />}>
			{object?.postedto !== "" &&
				object?.postedto !== undefined &&
				object?.postedto !== null && (
					<div className="d-flex justify-content-center">
						<p className="m-0">
							Posted&nbsp;on&nbsp;
							<Link
								href={{
									pathname: `/profile/${object.postedto._id}/${object.postedto.username}`,
									query: {
										page: 1,
										limit: 100,
										sort: "-createdAt",
									},
								}}
							>
								{object?.postedto?.username}
							</Link>
						</p>
					</div>
				)}
			{object?.postedfrom !== "" &&
				object?.postedfrom !== undefined &&
				object?.postedfrom !== null && (
					<div className="d-flex justify-content-center">
						<p className="m-0">
							Shared&nbsp;from&nbsp;
							<Link
								href={{
									pathname: `/profile/${object.postedfrom._id}/${object.postedfrom.username}`,
									query: {
										page: 1,
										limit: 100,
										sort: "-createdAt",
									},
								}}
							>
								{object?.postedfrom?.username}
							</Link>
						</p>
					</div>
				)}

			<article className={`${object?._id} mb-3`}>
				<div className="card">
					<div className="card-header d-flex justify-content-between align-items-center">
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
							>
								<Image
									src={object?.user?.files?.avatar?.location?.secure_location}
									className="rounded-5"
									width={35}
									height={35}
									alt={`${object.user.username}'s avatar`}
									style={{
										objectFit: "cover",
									}}
								/>
							</Link>
						</div>
						<div className="float-middle text-center">
							<Link
								href={{
									pathname: `/post/${object?._id}`,
									query: {},
								}}
							>
								{object?.title}
							</Link>
							&nbsp;by&nbsp;
							<Link
								href={{
									pathname: `/profile/${object.user._id}/${object.user.username}`,
									query: {
										page: 1,
										limit: 100,
										sort: "-createdAt",
									},
								}}
							>
								{object?.user?.username}
							</Link>
						</div>
						<div className="float-end">
							{auth?.userId === object?.user?._id && (
								<DropdownButton title="..." variant="secondary" size="sm">
									<button className="dropdown-item btn btn-sm">
										Edit&nbsp;post
									</button>
									{!object?.featured && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleFeature(object._id)}
										>
											Feature&nbsp;post
										</button>
									)}
									{object?.featured && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUnfeature(object._id)}
										>
											Unfeature&nbsp;post
										</button>
									)}
									{!object?.hidden && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleHide(object._id)}
										>
											Hide&nbsp;post
										</button>
									)}
									{object?.hidden && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUnhide(object._id)}
										>
											Unhide&nbsp;post
										</button>
									)}
									{!object?.commented && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleCommented(object._id)}
										>
											Enable&nbsp;comments
										</button>
									)}
									{object?.commented && (
										<button
											className="dropdown-item btn btn-sm"
											onClick={() => handleUncommented(object._id)}
										>
											Disable&nbsp;comments
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
							)}
						</div>
					</div>
					<div
						className={`card-body${
							object.subType === "audios" ||
							object.subType === "maps" ||
							object.subType === "photos" ||
							object.subType === "videos"
								? ` p-0`
								: ""
						}${object.subType === "photos" ? " card-post-body" : ""}`}
					>
						{object.subType === "audios" ? (
							<>
								<ParseHtml text={object.text} classList="p-1" />
								<Audio object={object} />
							</>
						) : object.subType === "files" ? (
							<>
								<ParseHtml text={object.text} classList="p-1" />
								<File object={object} />
							</>
						) : object.subType === "maps" ? (
							<>
								<ParseHtml text={object.text} classList="p-1" />
								<Map object={object} />
							</>
						) : object.subType === "photos" ? (
							<>
								<ParseHtml text={object.text} classList="p-1" />
								<Photo object={object} />
							</>
						) : object.subType === undefined ? (
							<Default object={object} />
						) : object.subType === "text" ? (
							<Text object={object} classList="p-1" />
						) : object.subType === "videos" ? (
							<>
								<ParseHtml text={object.text} classList="p-1" />
								<Video object={object} />
							</>
						) : (
							<Default object={object} />
						)}
						{object.tags.length > 0 &&
							object.tags.map((tag, index) => (
								<span key={index} className="badge bg-secondary me-1">
									#{tag.charAt(0).toUpperCase() + tag.slice(1)}
								</span>
							))}
					</div>
					<div className="card-footer d-flex justify-content-between align-items-center">
						<div className="float-start"></div>
						<div className="float-middle">
							{calculateTimeSincePublished(object?.createdAt)}
						</div>
						<div className="float-end">
							<ExportModal
								object={object}
								linkToShare={`/post/${object?._id}/${object?.slug}`}
							/>
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Post;
