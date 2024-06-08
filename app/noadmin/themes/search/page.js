import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/themes/list";
import { revalidatePath } from "next/cache";

async function getThemes(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");
	return res;
}

const AdminThemesSearchIndex = async ({ params, searchParams }) => {
	const themes = await getThemes(
		`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/themes/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=theme`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
				categoriesLink="/noadmin/themes/categories"
				categoryType="theme"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/themes"
					pageText="Themes"
					addLink="/noadmin/themes/create"
					searchOn="/noadmin/themes"
					objects={themes}
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

export default AdminThemesSearchIndex;
