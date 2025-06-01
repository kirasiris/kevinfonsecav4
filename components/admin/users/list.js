"use client";
import { useState } from "react";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
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
	handleAssignStripeCustomerId = () => {},
	handleAssignStripeAccountId = () => {},
	handleAssignStripeId = () => {},
	handleUpdateStripeSellerAccount = () => {},
	handleAssignStripeOnBoardingLink = () => {},
	handleDelete = () => {},
	handleDeleteAllFunction = () => {},
}) => {
	const [newobjects, setNewObjects] = useState(objects);
	const [, setTotalResults] = useState({
		...objects,
		countAll: objects?.countAll,
	});

	if (
		typeof handleAssignStripeCustomerId !== "function" &&
		handleAssignStripeCustomerId !== "" &&
		handleAssignStripeCustomerId !== undefined &&
		handleAssignStripeCustomerId !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleAssignStripeCustomerId parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleAssignStripeAccountId !== "function" &&
		handleAssignStripeAccountId !== "" &&
		handleAssignStripeAccountId !== undefined &&
		handleAssignStripeAccountId !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleAssignStripeAccountId parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleAssignStripeId !== "function" &&
		handleAssignStripeId !== "" &&
		handleAssignStripeId !== undefined &&
		handleAssignStripeId !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleAssignStripeId parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleUpdateStripeSellerAccount !== "function" &&
		handleUpdateStripeSellerAccount !== "" &&
		handleUpdateStripeSellerAccount !== undefined &&
		handleUpdateStripeSellerAccount !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleUpdateStripeSellerAccount parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleAssignStripeOnBoardingLink !== "function" &&
		handleAssignStripeOnBoardingLink !== "" &&
		handleAssignStripeOnBoardingLink !== undefined &&
		handleAssignStripeOnBoardingLink !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleAssignStripeOnBoardingLink parameter is not a function!. Please try again"
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

	return (
		<>
			<AdminCardHeaderMenu
				allLink={allLink}
				pageText={pageText}
				currentResults={objects?.count}
				totalResults={objects?.countAll}
				addLink={addLink}
				searchOn={searchOn}
				handleTrashAllFunction={handleAssignStripeId}
				handleDeleteAllFunction={handleDeleteAllFunction}
				classList=""
			/>
			{objects?.data?.length > 0 ? (
				<>
					<ul className="list-group list-group-flush">
						{objects?.data?.map((user) => (
							<Single
								key={user._id}
								object={user}
								handleAssignStripeCustomerId={handleAssignStripeCustomerId}
								handleAssignStripeAccountId={handleAssignStripeAccountId}
								handleAssignStripeId={handleAssignStripeId}
								handleUpdateStripeSellerAccount={
									handleUpdateStripeSellerAccount
								}
								handleAssignStripeOnBoardingLink={
									handleAssignStripeOnBoardingLink
								}
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
