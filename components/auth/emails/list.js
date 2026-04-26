"use client";
import { useState } from "react";
import ErrorPage from "@/layout/errorpage";
import DeleteModal from "@/components/global/deletemodal";

const List = ({
	objects = [],
	handleIsPrimary = () => {},
	handleRemoveEmail = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects.length,
	});

	if (
		typeof handleIsPrimary !== "function" &&
		handleIsPrimary !== "" &&
		handleIsPrimary !== undefined &&
		handleIsPrimary !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleIsPrimary parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleRemoveEmail !== "function" &&
		handleRemoveEmail !== "" &&
		handleRemoveEmail !== undefined &&
		handleRemoveEmail !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleRemoveEmail parameter is not a function!. Please try again"
				}
			/>
		);
	}

	return objects.map((object) => (
		<div key={object._id} className="d-flex mb-3">
			<input
				id={`email-${object._id}`}
				name=""
				value={object?.address}
				type="email"
				className={`form-control me-2${object?.isVerified ? " is-valid" : " is-invalid"}`}
				disabled
				placeholder={object?.address}
			/>
			<button
				className="btn btn-success btn-sm me-2"
				onClick={() => handleIsPrimary(object?._id)}
			>
				Primary?
			</button>
			<DeleteModal
				id={object?._id}
				action={handleRemoveEmail}
				classStr="btn btn-danger btn-sm"
				objects={newobjects}
				setObjects={setNewObjects}
				setTotalResults={setTotalResults}
			/>
		</div>
	));
};

export default List;
