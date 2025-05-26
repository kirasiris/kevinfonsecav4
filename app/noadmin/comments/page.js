import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/comments/list";
import { revalidatePath } from "next/cache";

async function getComments(params) {
	const res = await fetchurl(
		`/global/comments${params}&postType=comment`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCommentsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const comments = await getComments(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/comments/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/comments/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/comments?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/comments"
				publishedLink="/noadmin/comments/published"
				draftLink="/noadmin/comments/draft"
				scheduledLink="/noadmin/comments/scheduled"
				trashedLink="/noadmin/comments/trashed"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/comments"
					pageText="Comments"
					addLink="/noadmin/comments/create"
					searchOn="/noadmin/comments"
					searchedKeyword=""
					objects={comments}
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

export default AdminCommentsIndex;
