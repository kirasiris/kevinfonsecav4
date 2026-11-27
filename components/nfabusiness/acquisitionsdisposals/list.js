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
		handleAcquireIt,
		handleDisposeIt,
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
		endpoint: "/noadmin/weaponacquisitionsdisposals",
		noun: "weapon acquisition and disposal",
		nounPlural: "weapons acquisitions and disposals",
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
				handleTrashAllFunction=""
				handleDeleteAllFunction=""
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
						{rows.map((wad) => (
							<Single
								key={wad._id}
								object={wad}
								handleAcquire={handleAcquireIt}
								handleDispose={handleDisposeIt}
								handleDraft={undefined}
								handlePublish={undefined}
								handleTrash={undefined}
								handleSchedule={undefined}
								handleFeature={undefined}
								handleUnfeature={undefined}
								handleDelete={undefined}
								isAcquiring={isBusy(wad._id, "acquire")}
								isDisposing={isBusy(wad._id, "dispose")}
								isDrafting={false}
								isPublishing={false}
								isTrashing={false}
								isScheduling={false}
								isFeaturing={false}
								isUnfeaturing={false}
								isDeleting={false}
								leaving={leavingIds.has(wad._id)}
								entering={enteringIds.has(wad._id)}
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
