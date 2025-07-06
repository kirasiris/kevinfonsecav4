"use client";
import { useState } from "react";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";

const List = ({
	allLink = "",
	pageText = "",
	addLink = "",
	searchOn = "",
	searchedKeyword = "",
	objects = [],
	searchParams = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleTrashAllFunction = () => {},
	handleDeleteAllFunction = () => {},
	handleDeleteAllEmptyFunction = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects?.countAll,
	});

	const groupByDate = objects?.data?.reduce((groups, changelog) => {
		const date = changelog.createdAt.split("T")[0];
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(changelog);
		return groups;
	}, {});

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
		typeof handleDeleteAllEmptyFunction !== "function" &&
		handleDeleteAllEmptyFunction !== "" &&
		handleDeleteAllEmptyFunction !== undefined &&
		handleDeleteAllEmptyFunction !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDeleteAllEmptyFunction parameter is not a function!. Please try again"
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
				handleTrashAllFunction={handleTrashAllFunction}
				handleDeleteAllFunction={handleDeleteAllFunction}
				// handleDeleteAllEmptyFunction={handleDeleteAllEmptyFunction}
				classList=""
			/>
			{objects?.data?.length > 0 ? (
				<>
					<ul className="list-group list-group-flush">
						{Object.entries(groupByDate)?.map(([date, list]) => (
							<div key={date}>
								<p className="text-center my-3">{date}</p>
								{list?.map((changelog) => (
									<Single
										key={changelog._id}
										object={changelog}
										handleDelete={handleDelete}
										objects={newobjects}
										setObjects={setNewObjects}
										setTotalResults={setTotalResults}
									/>
								))}
							</div>
						))}
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
					text={`Nothing found with ${searchedKeyword}`}
				/>
			)}
		</>
	);
};

export default List;
