"use client";
import { useState } from "react";
import ErrorPage from "@/layout/errorpage";
import DeleteModal from "@/components/global/deletemodal";

const List = ({
	objects = [],
	handleIsPrimary = () => {},
	handleRemoveAddress = () => {},
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
		typeof handleRemoveAddress !== "function" &&
		handleRemoveAddress !== "" &&
		handleRemoveAddress !== undefined &&
		handleRemoveAddress !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleRemoveAddress parameter is not a function!. Please try again"
				}
			/>
		);
	}

	return (
		objects.length > 0 && (
			<>
				<hr />
				{objects.map((object) => (
					<div key={object._id} className="d-flex mb-3">
						<input
							id={`text-${object._id}`}
							name="address"
							value={object?.address}
							type="text"
							className={`form-control me-2${object?.isPrimary ? " is-valid" : " is-invalid"}`}
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
							sId={null}
							location=""
							as="button"
							size="sm"
							classStr="btn btn-danger btn-sm"
							action={handleRemoveAddress}
							action2={() => {}}
							objects={newobjects}
							setObjects={setNewObjects}
							setTotalResults={setTotalResults}
							displayText={false}
						/>
					</div>
				))}
			</>
		)
	);
};

export default List;
