"use client";
import { useState } from "react";
import AdminCardHeaderMenu from "@/components/admin/emails/emailcardheadermenu";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";

const List = ({
	allLink = "",
	pageText = "",
	searchOn = "",
	searchedKeyword = "",
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
				allLink={allLink}
				pageText={pageText}
				currentResults={objects?.count}
				totalResults={objects?.countAll}
				searchOn={searchOn}
				handleDeleteAllFunction={handleDeleteAllFunction}
				classList=""
			/>
			{objects?.data?.length > 0 ? (
				<>
					<ul className="list-group list-group-flush">
						{objects?.data?.map((email) => (
							<Single
								key={email._id}
								object={email}
								handleDelete={handleDelete}
								objects={newobjects.data}
								setObjects={setNewObjects}
								setTotalResults={setTotalResults}
							/>
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
