import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/reviews/list";
import { revalidatePath } from "next/cache";

async function getReviews(params) {
	const res = await fetchurl(
		`/comments${params}&postType=review`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminReviewsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const reviews = await getReviews(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/reviews?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/reviews"
				publishedLink="/noadmin/reviews/published"
				draftLink="/noadmin/reviews/draft"
				scheduledLink="/noadmin/reviews/scheduled"
				trashedLink="/noadmin/reviews/trashed"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/reviews"
					pageText="Reviews"
					addLink="/noadmin/reviews/create"
					searchOn="/noadmin/reviews"
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

export default AdminReviewsIndex;
