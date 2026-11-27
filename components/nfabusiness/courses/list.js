"use client";
import AdminCardHeaderMenu from "@/components/noadmin/admincardheadermenu";
import {
	useAdminListActions,
	usePagedList,
} from "@/components/noadmin/adminlistactions";
import Single from "./single";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";

const List = ({
	stripeChargesEnabled = false,
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
		handleArchiveIt,
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
		endpoint: "/noadmin/stripe/courses",
		noun: "course",
		nounPlural: "courses",
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
				stripeChargesEnabled ? (
					<>
						<ul
							className="list-group list-group-flush"
							aria-busy={trashingAll || deletingAll || undefined}
						>
							{rows.map((course) => (
								<Single
									key={course._id}
									object={course}
									handleArchive={handleArchiveIt}
									handleDraft={handleDraftIt}
									handlePublish={handlePublishIt}
									handleTrash={undefined}
									handleSchedule={handleScheduleIt}
									handleFeature={handleFeatureIt}
									handleUnfeature={handleUnfeatureIt}
									handleDelete={handleDeleteIt}
									isArchiving={isBusy(course._id, "archive")}
									isDrafting={isBusy(course._id, "draft")}
									isPublishing={isBusy(course._id, "publish")}
									isTrashing={false}
									isScheduling={isBusy(course._id, "schedule")}
									isFeaturing={isBusy(course._id, "feature")}
									isUnfeaturing={isBusy(course._id, "unfeature")}
									isDeleting={isBusy(course._id, "delete")}
									leaving={leavingIds.has(course._id)}
									entering={enteringIds.has(course._id)}
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
					<OnboardingLink />
				)
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
