"use client";
import { useState } from "react";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import ErrorPage from "@/layout/errorpage";
import OnboardingLink from "@/components/dashboard/onboardinglink";

const List = ({
	stripeChargesEnabled = false,
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
	handleTrashAllFunction = () => {},
	handleDeleteAllFunction = () => {},
	handleActivate = () => {},
	handleDisactivate = () => {},
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

	if (
		typeof handleActivate !== "function" &&
		handleActivate !== "" &&
		handleActivate !== undefined &&
		handleActivate !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleActivate parameter is not a function!. Please try again"
				}
			/>
		);
	}

	if (
		typeof handleDisactivate !== "function" &&
		handleDisactivate !== "" &&
		handleDisactivate !== undefined &&
		handleDisactivate !== null
	) {
		return (
			<ErrorPage
				statusCodeMessage={
					"The handleDisactivate parameter is not a function!. Please try again"
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
				classList=""
			/>
			{objects?.data?.length > 0 ? (
				stripeChargesEnabled ? (
					<>
						<ul className="list-group list-group-flush">
							{objects?.data?.map((membership) => (
								<Single
									key={membership._id}
									object={membership}
									handleDraft={handleDraft}
									handlePublish={handlePublish}
									handleTrash={handleTrash}
									handleSchedule={handleSchedule}
									handleDelete={handleDelete}
									objects={newobjects.data}
									setObjects={setNewObjects}
									setTotalResults={setTotalResults}
									handleActivate={handleActivate}
									handleDisactivate={handleDisactivate}
								/>
							))}
							<li className="list-group-item">
								{objects?.pagination?.current} /{" "}
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
						<p className="text-center text-uppercase text-decoration-underline text-bg-primary">
							NOTE: You need to disactivate them first in order to delete them.
						</p>
						<p className="text-center text-uppercase text-decoration-underline text-bg-primary">
							Furthermore if prices are attached, you will need to archive said
							prices on Stripe directly!
						</p>
						<p>YOU CANNOT DELETE PRICES ON BACKEND, I TRIED!</p>
					</>
				) : (
					<OnboardingLink />
				)
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
