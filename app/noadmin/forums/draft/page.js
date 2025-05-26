import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/forums/list";

async function getForums(params) {
	const res = await fetchurl(
		`/global/forums${params}&status=draft`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminForumsDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const forums = await getForums(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/forums/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/forums/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/forums/draft?page=${page}&limit=${limit}&sort=${sort}`
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
					searchedKeyword=""
					objects={forums}
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

export default AdminForumsDraftIndex;
