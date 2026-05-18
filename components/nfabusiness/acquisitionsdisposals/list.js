"use client";
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
}) => {
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
				handleTrashAllFunction={undefined}
				handleDeleteAllFunction={undefined}
				classList=""
				// isDirty={isDirty}
				// saving={saving}
				// handleSave={handleSave}
			/>
			{objects?.data?.length > 0 ? (
				<>
					<ul className="list-group list-group-flush">
						{objects?.data?.map((acquisitiondisposal) => (
							<Single
								key={acquisitiondisposal._id}
								object={acquisitiondisposal}
								handleDraft={handleDraft}
								handlePublish={handlePublish}
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

export default List;
