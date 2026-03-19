import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/realestates/list";

async function getRealEstates(params) {
	const res = await fetchurl(
		`/global/realestates${params}&postType=realestate&status=published`,
		"GET",
		"no-cache",
	);
	return res;
}

const NFARealEstatesPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const realstates = await getRealEstates(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/${id}/draftit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/${id}/publishit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/${id}/trashit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/${id}/scheduleit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/realestates/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/realestates/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/realestates/published?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/realestates"
				publishedLink="/nfabusiness/realestates/published"
				draftLink="/nfabusiness/realestates/draft"
				scheduledLink="/nfabusiness/realestates/scheduled"
				trashedLink="/nfabusiness/realestates/trashed"
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/realestates"
					pageText="Real States"
					addLink="/nfabusiness/realestates/create"
					searchOn="/nfabusiness/realestates"
					searchedKeyword=""
					objects={realstates}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
					handleTrash={trashIt}
					handleSchedule={scheduleIt}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default NFARealEstatesPublishedIndex;
