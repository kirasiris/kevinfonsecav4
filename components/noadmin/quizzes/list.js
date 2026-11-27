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
		handleFeatureIt,
		handleUnfeatureIt,
		handleDeleteIt,
		trashingAll,
		deletingAll,
		handleTrashAll,
		handleDeleteAll,
	} = useAdminListActions({
		list,
		endpoint: "/noadmin/quizzes",
		noun: "quiz",
		nounPlural: "quizzes",
		statusFilter,
	});

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
				handleTrashAllFunction={handleTrashAll}
				handleDeleteAllFunction={handleDeleteAll}
				classList=""
				handleAllUsageCountEnabled={false}
				handleAllUsageCount={undefined}
				countingAll={false}
				// isDirty={isDirty}
				// saving={saving}
				// handleSave={handleSave}
			/>
			{rows.length > 0 ? (
				<>
					<ul
						className="list-group list-group-flush"
						aria-busy={trashingAll || deletingAll || undefined}
					>
						{rows.map((quiz) => (
							<Single
								key={quiz._id}
								object={quiz}
								handleDraft={handleDraftIt}
								handlePublish={handlePublishIt}
								handleTrash={handleTrashIt}
								handleSchedule={handleScheduleIt}
								handleFeature={undefined}
								handleUnfeature={undefined}
								handleDelete={handleDeleteIt}
								isDrafting={isBusy(quiz._id, "draft")}
								isPublishing={isBusy(quiz._id, "publish")}
								isTrashing={isBusy(quiz._id, "trash")}
								isScheduling={isBusy(quiz._id, "schedule")}
								isFeaturing={false}
								isUnfeaturing={false}
								isDeleting={isBusy(quiz._id, "delete")}
								leaving={leavingIds.has(quiz._id)}
								entering={enteringIds.has(quiz._id)}
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
