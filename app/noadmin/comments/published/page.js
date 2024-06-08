import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/comments/list";
import { revalidatePath } from "next/cache";

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

const AdminCommentsPublishedIndex = async ({ params, searchParams }) => {
	const comments = await getComments(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
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
					objects={comments}
					searchParams={searchParams}
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

export default AdminCommentsPublishedIndex;
