import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/menus/list";
import { revalidatePath } from "next/cache";

async function getMenus(params) {
	const res = await fetchurl(
		`/menus${params}&status=published`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminMenusPublishedIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const menus = await getMenus(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/menus/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/menus/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/menus"
				publishedLink="/noadmin/menus/published"
				draftLink="/noadmin/menus/draft"
				scheduledLink="/noadmin/menus/scheduled"
				trashedLink="/noadmin/menus/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/menus"
					pageText="Menus"
					addLink="/noadmin/menus/create"
					searchOn="/noadmin/menus"
					objects={menus}
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

export default AdminMenusPublishedIndex;
