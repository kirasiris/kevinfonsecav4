"use client";
import { useState } from "react";
import Link from "next/link";
import Single from "../comment/single";
import NumericPagination from "@/layout/numericpagination";
import ErrorPage from "@/layout/errorpage";

const CommentBox = ({
	auth = {},
	allLink = "",
	pageText = "",
	objects = [],
	searchParams = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleTrashAllFunction = () => {},
	handleDeleteAllFunction = () => {},
	displayPagination = true,
	isChildCommment = false,
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
	return (
		objects?.data?.length > 0 && (
			<>
				<h5>
					<Link
						href={{
							pathname: allLink.split("?")[0],
							query: {
								resourceId: allLink.split("?")[1].split("&")[0].split("=")[1],
								page: allLink.split("?")[1].split("&")[1].split("=")[1],
								limit: allLink.split("?")[1].split("&")[2].split("=")[1],
								sort: allLink.split("?")[1].split("&")[3].split("=")[1],
								status: allLink.split("?")[1].split("&")[4].split("=")[1],
							},
						}}
					>
						{pageText}
					</Link>
					: {objects?.countAll}
				</h5>
				{!isChildCommment &&
					objects?.data
						.filter((child) => child.parentId === null)
						.map((comment) => (
							<Single
								key={comment._id}
								auth={auth}
								object={comment}
								handleDraft={handleDraft}
								handlePublish={handlePublish}
								handleTrash={handleTrash}
								handleSchedule={handleSchedule}
								handleDelete={handleDelete}
								objects={newobjects.data}
								setObjects={setNewObjects}
								setTotalResults={setTotalResults}
							/>
						))}
				{isChildCommment &&
					objects?.data
						.filter((child) => child.parentId !== null)
						.map((comment) => (
							<Single
								key={comment._id}
								auth={auth}
								object={comment}
								handleDraft={handleDraft}
								handlePublish={handlePublish}
								handleTrash={handleTrash}
								handleSchedule={handleSchedule}
								handleDelete={handleDelete}
								objects={newobjects.data}
								setObjects={setNewObjects}
								setTotalResults={setTotalResults}
							/>
						))}
				{displayPagination && (
					<NumericPagination
						totalPages={
							objects?.pagination?.totalpages ||
							Math.ceil(objects?.data?.length / searchParams.limit)
						}
						searchParams={searchParams}
						siblings={1}
					/>
				)}
			</>
		)
	);
};
export default CommentBox;
