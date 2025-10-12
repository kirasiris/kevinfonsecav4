"use client";
import { useState } from "react";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";
import UseDropzone from "@/components/global/dropzone";

const List = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	multipleFiles = false,
	onModel = "Blog",
	objects = [],
	searchParams = {},
	handleDelete = () => {},
	handleDeleteAllFunction = () => {},
	handleDeleteAllInvalidPermanentlyFunction = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects?.countAll,
	});

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
									handleDelete={handleDelete}
									objects={newobjects.data}
									setObjects={setNewObjects}
									setTotalResults={setTotalResults}
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
						isAdmin={false}
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
