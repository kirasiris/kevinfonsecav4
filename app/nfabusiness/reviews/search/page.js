import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/noadmin/reviews/list";

async function getReviews(params) {
	const res = await fetchurl(
		`/global/comments${params}&postType=review`,
		"GET",
		"no-cache",
	);
	return res;
}

const NFAReviewsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const reviews = await getReviews(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reviews/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/reviews/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/reviews/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/reviews"
				publishedLink="/nfabusiness/reviews/published"
				draftLink="/nfabusiness/reviews/draft"
				scheduledLink="/nfabusiness/reviews/scheduled"
				trashedLink="/nfabusiness/reviews/trashed"
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/reviews"
					pageText="Reviews"
					addLink="/nfabusiness/reviews/create"
					searchOn="/nfabusiness/reviews"
					searchedKeyword={keyword}
					objects={reviews}
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

export default NFAReviewsSearchIndex;
