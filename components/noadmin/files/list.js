"use client";
import { useState } from "react";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
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
	allLink = "",
	pageText = "",
	addLink = "",
	searchOn = "",
	objects = [],
	searchParams = {},
	handleDelete = () => {},
	handleDeleteAllFunction = () => {},
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
				handleDeleteAllFunction={handleDeleteAllFunction}
				classList="mb-5"
				handleAllUsageCountEnabled={false}
				handleAllUsageCount={undefined}
				// isDirty={isDirty}
				// saving={saving}
				// handleSave={handleSave}
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
