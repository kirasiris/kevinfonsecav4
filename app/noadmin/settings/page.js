import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/settings/list";
import { revalidatePath } from "next/cache";

async function getSettings(params) {
	const res = await fetchurl(`/settings${params}`, "GET", "no-cache");
	return res;
}

const AdminSettingsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const settings = await getSettings(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/settings/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/settings?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/settings"
				publishedLink="/noadmin/settings/published"
				draftLink="/noadmin/settings/draft"
				scheduledLink="/noadmin/settings/scheduled"
				trashedLink="/noadmin/settings/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/settings"
					pageText="Settings"
					addLink="/noadmin/settings/create"
					searchOn="/noadmin/settings"
					objects={settings}
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

export default AdminSettingsIndex;
