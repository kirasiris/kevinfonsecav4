"use client";
import { useState } from "react";
import Filter from "./filter";
// import PostNew from "./postnew";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
// import Sidebar from "./sidebar";
import Globalcontent from "@/layout/content";
import Single from "./post/single";
import ErrorPage from "@/layout/errorpage";

const List = ({
	auth = {},
	object = {},
	stories = [],
	featured = {},
	params = {},
	objects = [],
	searchParams = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleTrashAllFunction = () => {},
	handleDeleteAllFunction = () => {},
	handleFeature = () => {},
	handleUnfeature = () => {},
	handleHide = () => {},
	handleUnhide = () => {},
	handleCommented = () => {},
	handleUncommented = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects?.countAll,
	});

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
		typeof handleTrashAllFunction !== "function" &&
		handleTrashAllFunction !== "" &&
		handleTrashAllFunction !== undefined &&
		handleTrashAllFunction !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleTrashAllFunction parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleDeleteAllFunction !== "function" &&
		handleDeleteAllFunction !== "" &&
		handleDeleteAllFunction !== undefined &&
		handleDeleteAllFunction !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDeleteAllFunction parameter is not a function!. Please try again"
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

	return (
		<>
			{/* Stories */}
			{/* {stories?.data?.length > 0 && (
							<div className="row mb-3">
								{stories.data?.map((story) => (
									<SingleStory key={story._id} story={story} />
								))}
							</div>
						)} */}
			<Filter params={params} />
			{/* Featured list */}
			{featured?.data?.length > 0 && (
				<>
					<h2>Featured</h2>
					{featured.data?.map((featured) => (
						<Single
							key={featured._id}
							auth={auth}
							object={featured}
							handleDraft={handleDraft}
							handlePublish={handlePublish}
							handleTrash={handleTrash}
							handleSchedule={handleSchedule}
							handleDelete={handleDelete}
							handleFeature={handleFeature}
							handleUnfeature={handleUnfeature}
							handleHide={handleHide}
							handleUnhide={handleUnhide}
							handleCommented={handleCommented}
							handleUncommented={handleUncommented}
							objects={newobjects.data}
							setObjects={setNewObjects}
							setTotalResults={setTotalResults}
						/>
					))}
				</>
			)}
			{/* Post timeline */}
			{objects?.data?.length > 0 && (
				<>
					<h2>Timeline</h2>
					{objects.data?.map((post) => (
						<Single
							key={post._id}
							auth={auth}
							object={post}
							handleDraft={handleDraft}
							handlePublish={handlePublish}
							handleTrash={handleTrash}
							handleSchedule={handleSchedule}
							handleDelete={handleDelete}
							handleFeature={handleFeature}
							handleUnfeature={handleUnfeature}
							handleHide={handleHide}
							handleUnhide={handleUnhide}
							handleCommented={handleCommented}
							handleUncommented={handleUncommented}
							objects={newobjects.data}
							setObjects={setNewObjects}
							setTotalResults={setTotalResults}
						/>
					))}
				</>
			)}
		</>
	);
};

export default List;
