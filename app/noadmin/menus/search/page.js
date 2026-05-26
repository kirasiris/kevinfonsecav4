import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/menus/list";

async function getMenus(params) {
	const res = await fetchurl(`/global/menus${params}`, "GET", "no-cache");
	return res;
}

const AdminMenusSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const menus = await getMenus(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/menus/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/menus/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/menus/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
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
					searchedKeyword={keyword}
					objects={menus}
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

export default AdminMenusSearchIndex;
