import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/themes/list";

async function getThemes(params) {
	const res = await fetchurl(
		`/global/themes${params}&postType=theme&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminThemesScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const themes = await getThemes(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/themes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/themes/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/themes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
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
					searchedKeyword=""
					objects={themes}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
					handleTrash={trashIt}
					handleSchedule={scheduleIt}
					handleFeature={featureIt}
					handleUnfeature={unfeatureIt}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminThemesScheduledIndex;
