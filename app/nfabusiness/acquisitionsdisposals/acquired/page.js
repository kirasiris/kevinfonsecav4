import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/acquisitionsdisposals/list";

async function getAcquisitionsDisposals(params) {
	const res = await fetchurl(
		`/global/acquisitionsdisposals${params}&status=acquired`,
		"GET",
		"no-cache"
	);
	return res;
}

const NFAAcquisitionDisposalsAcquiredIndex = async ({
	params,
	searchParams,
}) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const acquisitionsdisposals = await getAcquisitionsDisposals(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const acquireIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/acquisitionsdisposals/${id}/acquireit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/acquisitionsdisposals/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const disposeIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/acquisitionsdisposals/${id}/disposeit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/acquisitionsdisposals/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/acquisitionsdisposals"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
				acquiredLink="/nfabusiness/acquisitionsdisposals/acquired"
				disposedLink="/nfabusiness/acquisitionsdisposals/disposed"
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/acquisitionsdisposals"
					pageText="Acquisitions and Disposals"
					addLink="/nfabusiness/acquisitionsdisposals/create"
					searchOn="/nfabusiness/acquisitionsdisposals"
					searchedKeyword=""
					objects={acquisitionsdisposals}
					searchParams={awtdSearchParams}
					handleDraft={acquireIt}
					handlePublish={disposeIt}
					handleTrash={undefined}
					handleSchedule={undefined}
					handleFeature={undefined}
					handleUnfeature={undefined}
					handleDelete={undefined}
					handleTrashAllFunction={""}
					handleDeleteAllFunction={""}
				/>
			</div>
		</>
	);
};

export default NFAAcquisitionDisposalsAcquiredIndex;
