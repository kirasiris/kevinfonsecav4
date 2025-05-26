"use client";
import { useState } from "react";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";
import AdminCardHeaderMenu from "../admincardheadermenu";
import UseDropzone from "@/components/global/dropzone";

const List = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	multipleFiles = false,
	onModel = "Blog",
	allLink = "",
	pageText = "",
	addLink = "",
	searchOn = "",
	objects = [],
	searchParams = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleDeleteAllFunction = () => {},
	handleDeleteAllInvalidPermanentlyFunction = () => {},
	setSelectedObject = () => {},
	setShowMediaModel = () => {},
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
		typeof handleDeleteAllInvalidPermanentlyFunction !== "function" &&
		handleDeleteAllInvalidPermanentlyFunction !== "" &&
		handleDeleteAllInvalidPermanentlyFunction !== undefined &&
		handleDeleteAllInvalidPermanentlyFunction !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDeleteAllInvalidPermanentlyFunction parameter is not a function!. Please try again"
				}
			/>
		);
	}

	return (
		<>
			<AdminCardHeaderMenu
				allLink={allLink}
				pageText={pageText}
				currentResults={objects?.count}
				totalResults={objects?.countAll}
				addLink={addLink}
				searchOn={searchOn}
				handleDeleteAllFunction={handleDeleteAllFunction}
				handleDeleteAllInvalidPermanentlyFunction={
					handleDeleteAllInvalidPermanentlyFunction
				}
				classList="mb-5"
			/>
			<UseDropzone
				auth={auth}
				token={token}
				id={id}
				name={name}
				multipleFiles={multipleFiles}
				onModel={onModel}
			/>
			{objects?.data?.length > 0 ? (
				<>
					<div className="card-body">
						<div className="row">
							{objects?.data?.map((file) => (
								<Single
									key={file._id}
									object={file}
									handleDraft={handleDraft}
									handlePublish={handlePublish}
									handleTrash={handleTrash}
									handleSchedule={handleSchedule}
									handleDelete={handleDelete}
									objects={newobjects.data}
									setObjects={setNewObjects}
									setTotalResults={setTotalResults}
									setSelectedObject={setSelectedObject}
									setShowMediaModel={setShowMediaModel}
								/>
							))}
						</div>
					</div>
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							{objects?.pagination?.current} / {objects?.pagination?.totalpages}
						</li>
					</ul>
					<NumericPagination
						totalPages={
							objects?.pagination?.totalpages ||
							Math.ceil(objects?.data?.length / searchParams.limit)
						}
						searchParams={searchParams}
						siblings={1}
					/>
				</>
			) : (
				<NothingFoundAlert
					classList="alert-danger rounded-0 m-0 border-0"
					text="Nothing found"
				/>
			)}
		</>
	);
};

export default List;
