import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/realstates/list";

async function getRealStates(params) {
	const res = await fetchurl(
		`/global/realstates${params}&status=draft`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminRealStatesDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const realstates = await getRealStates(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/realstates/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/realstates/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/realstates/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/realstates/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/realstates/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/realstates/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/realstates/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/realstates/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/realstates"
				publishedLink="/noadmin/realstates/published"
				draftLink="/noadmin/realstates/draft"
				scheduledLink="/noadmin/realstates/scheduled"
				trashedLink="/noadmin/realstates/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/realstates"
					pageText="Real States"
					addLink="/noadmin/realstates/create"
					searchOn="/noadmin/realstates"
					searchedKeyword=""
					objects={realstates}
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

export default AdminRealStatesDraftIndex;
