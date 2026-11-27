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
	postType = "",
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
		handleDeleteIt,
		trashingAll,
		deletingAll,
		handleTrashAll,
		handleDeleteAll,
	} = useAdminListActions({
		list,
		endpoint: "/noadmin/comments",
		noun: "comment",
		nounPlural: "comments",
		statusFilter,
		bulkBody: { postType },
	});

	const canRunBulk = postType !== "";

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
						{rows.map((comment) => (
							<Single
								key={comment._id}
								object={comment}
								handleDraft={handleDraftIt}
								handlePublish={handlePublishIt}
								handleTrash={handleTrashIt}
								handleSchedule={undefined}
								handleFeature={undefined}
								handleUnfeature={undefined}
								handleDelete={handleDeleteIt}
								isDrafting={isBusy(comment._id, "draft")}
								isPublishing={isBusy(comment._id, "publish")}
								isTrashing={isBusy(comment._id, "trash")}
								isScheduling={false}
								isFeaturing={false}
								isUnfeaturing={false}
								isDeleting={isBusy(comment._id, "delete")}
								leaving={leavingIds.has(comment._id)}
								entering={enteringIds.has(comment._id)}
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
