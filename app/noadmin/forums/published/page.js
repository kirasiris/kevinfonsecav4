import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/forums/list";
import { revalidatePath } from "next/cache";

async function getForums(params) {
	const res = await fetchurl(
		`/forums${params}&status=published`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminForumsPublishedIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const forums = await getForums(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/forums/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/forums/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/forums"
				publishedLink="/noadmin/forums/published"
				draftLink="/noadmin/forums/draft"
				scheduledLink="/noadmin/forums/scheduled"
				trashedLink="/noadmin/forums/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/forums"
					pageText="Forums"
					addLink="/noadmin/forums/create"
					searchOn="/noadmin/forums"
					objects={forums}
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

export default AdminForumsPublishedIndex;