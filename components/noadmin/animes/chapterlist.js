"use client";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import Single from "./chaptersingle";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";

const ChapterList = ({
	allLink = "",
	pageText = "",
	addLink = "",
	searchOn = "",
	searchedKeyword = "",
	object = {},
	objects = [],
	searchParams = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	handleTrashAllFunction = () => {},
	handleDeleteAllFunction = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects?.countAll,
	});

	// const initial = objects;
	// const [items, setItems] = useState(initial?.data || []);
	// const [, setTotalResults] = useState({
	// 	...objects,
	// 	countAll: objects?.countAll,
	// });
	// const [isDirty, setIsDirty] = useState(false);
	// const [saving, setSaving] = useState(false);

	// const dragIndex = useRef(null);
	// const overIndex = useRef(null);
	// const [draggingIndex, setDraggingIndex] = useState(null);
	// const [overIdx, setOverIdx] = useState(null);

	// const handleDragStart = (e, index) => {
	// 	dragIndex.current = index;
	// 	setDraggingIndex(index);
	// 	e.dataTransfer.effectAllowed = "move";
	// 	// Required for Firefox to initiate drag
	// 	try {
	// 		e.dataTransfer.setData("text/plain", String(index));
	// 	} catch (err) {}
	// };

	// const handleDragOver = (e, index) => {
	// 	e.preventDefault();
	// 	e.dataTransfer.dropEffect = "move";
	// 	if (overIndex.current !== index) {
	// 		overIndex.current = index;
	// 		setOverIdx(index);
	// 	}
	// };

	// const handleDrop = (e, index) => {
	// 	e.preventDefault();
	// 	const from = dragIndex.current;
	// 	const to = index;
	// 	if (from === null || from === undefined || from === to) {
	// 		resetDrag();
	// 		return;
	// 	}
	// 	const next = [...items];
	// 	const [moved] = next.splice(from, 1);
	// 	next.splice(to, 0, moved);
	// 	setItems(next);
	// 	setIsDirty(true);
	// 	resetDrag();
	// };

	// const handleDragEnd = () => {
	// 	resetDrag();
	// };

	// const resetDrag = () => {
	// 	dragIndex.current = null;
	// 	overIndex.current = null;
	// 	setDraggingIndex(null);
	// 	setOverIdx(null);
	// };

	// const handleSave = async () => {
	// 	setSaving(true);
	// 	const rawFormData = {
	// 		order: items.map((it, idx) => ({
	// 			_id: it._id,
	// 			orderingNumber: idx + 1,
	// 		})),
	// 	};

	// 	const res = await fetchurl(
	// 		`/noadmin/videos/${object?._id}/updateorder`,
	// 		"PUT",
	// 		"no-cache",
	// 		rawFormData,
	// 		undefined,
	// 		false,
	// 		false,
	// 	);

	// 	if (res.status === "error") {
	// 		toast.error(res.message, "bottom");
	// 		return;
	// 	}
	// 	if (res.status === "fail") {
	// 		toast.error(res.message, "bottom");
	// 		return;
	// 	}

	// 	setIsDirty(false);
	// 	setSaving(false);
	// 	toast.success("Order saved successfully");
	// };

	// const handleReset = () => {
	// 	setItems(items);
	// 	setIsDirty(false);
	// };

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
		<>
			<AdminCardHeaderMenu
				stripeChargesEnabled={false}
				allLink={allLink}
				pageText={pageText}
				currentResults={objects?.count}
				totalResults={objects?.countAll}
				addLink={addLink}
				searchOn={searchOn}
				handleTrashAllFunction={handleTrashAllFunction}
				handleDeleteAllFunction={handleDeleteAllFunction}
				classList=""
				handleAllUsageCountEnabled={false}
				handleAllUsageCount={undefined}
				// isDirty={isDirty}
				// saving={saving}
				// handleSave={handleSave}
			/>
			{objects?.data?.length > 0 ? (
				<>
					<ul
						className="list-group list-group-flush"
						style={{ maxHeight: "1000px" }}
					>
						{objects?.data?.map((chapter, index) => (
							<Single
								key={chapter._id}
								object={chapter}
								handleDraft={handleDraft}
								handlePublish={handlePublish}
								handleTrash={handleTrash}
								handleSchedule={handleSchedule}
								handleDelete={handleDelete}
								objects={newobjects.data}
								setObjects={setNewObjects}
								setTotalResults={setTotalResults}
								// index={index}
								// isDragging={draggingIndex === index}
								// isOver={overIdx === index && draggingIndex !== index}
								// onDragStart={handleDragStart}
								// onDragOver={handleDragOver}
								// onDrop={handleDrop}
								// onDragEnd={handleDragEnd}
							/>
						))}
						<li className="list-group-item">
							{objects?.pagination?.current}&nbsp;/&nbsp;
							{objects?.pagination?.totalpages}
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

export default ChapterList;
