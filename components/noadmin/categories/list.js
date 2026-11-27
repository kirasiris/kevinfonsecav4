"use client";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import {
	useAdminListActions,
	usePagedList,
} from "@/components/noadmin/adminlistactions";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";

const List = ({
	allLink = "",
	pageText = "",
	addLink = "",
	searchOn = "",
	searchedKeyword = "",
	objects = [],
	searchParams = {},
	statusFilter = "",
	categoryType = "",
	handleAllUsageCountEnabled = false,
}) => {
	const list = usePagedList({ objects, searchParams });
	const {
		rows,
		visibleCount,
		visibleCountAll,
		leavingIds,
		enteringIds,
		currentPage,
		totalPages,
		loadError,
		leaveRow,
		finishLeave,
		finishEnter,
	} = list;

	const {
		isBusy,
		handleDraftIt,
		handlePublishIt,
		handleTrashIt,
		handleScheduleIt,
		handleDeleteIt,
		handleUsageCountIt,
		trashingAll,
		deletingAll,
		countingAll,
		handleTrashAll,
		handleDeleteAll,
		handleUsageCountAll,
	} = useAdminListActions({
		list,
		endpoint: "/noadmin/categories",
		noun: "category",
		nounPlural: "categories",
		statusFilter,
		bulkBody: { categoryType },
		usageCountAllEndpoint: "/noadmin/maintenanceops/categories/allusagecount",
	});

	const canRunBulk = categoryType !== "";

	const emptyText =
		loadError ||
		(searchedKeyword
			? `Nothing found with "${searchedKeyword}"`
			: "Nothing found");

	return (
		<>
			<AdminCardHeaderMenu
				stripeChargesEnabled={false}
				allLink={allLink}
				pageText={pageText}
				currentResults={visibleCount}
				totalResults={visibleCountAll}
				addLink={addLink}
				searchOn={searchOn}
				handleTrashAllFunction={canRunBulk ? handleTrashAll : ""}
				handleDeleteAllFunction={canRunBulk ? handleDeleteAll : ""}
				classList=""
				handleAllUsageCountEnabled={handleAllUsageCountEnabled}
				handleAllUsageCount={handleUsageCountAll}
				countingAll={countingAll}
				// isDirty={isDirty}
				// saving={saving}
				// handleSave={handleSave}
			/>
			{rows.length > 0 ? (
				<>
					<ul
						className="list-group list-group-flush"
						aria-busy={trashingAll || deletingAll || countingAll || undefined}
					>
						{rows.map((category) => (
							<Single
								key={category._id}
								object={category}
								handleDraft={handleDraftIt}
								handlePublish={handlePublishIt}
								handleTrash={handleTrashIt}
								handleSchedule={handleScheduleIt}
								handleDelete={handleDeleteIt}
								handleUsageCount={handleUsageCountIt}
								isDrafting={isBusy(category._id, "draft")}
								isPublishing={isBusy(category._id, "publish")}
								isTrashing={isBusy(category._id, "trash")}
								isScheduling={isBusy(category._id, "schedule")}
								isDeleting={isBusy(category._id, "delete")}
								isCounting={isBusy(category._id, "usageCount")}
								leaving={leavingIds.has(category._id)}
								entering={enteringIds.has(category._id)}
								onLeft={finishLeave}
								onEntered={finishEnter}
								onDeleted={leaveRow}
							/>
						))}
						<li className="list-group-item">
							{currentPage}&nbsp;/&nbsp;
							{totalPages}
						</li>
					</ul>
					<NumericPagination
						totalPages={totalPages}
						searchParams={searchParams}
						siblings={1}
					/>
				</>
			) : (
				<NothingFoundAlert
					classList="alert-danger rounded-0 m-0 border-0"
					text={emptyText}
				/>
			)}
		</>
	);
};

export default List;
