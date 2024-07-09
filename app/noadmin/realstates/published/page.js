import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/realstates/list";
import { revalidatePath } from "next/cache";

async function getRealStates(params) {
	const res = await fetchurl(
		`/realstates${params}&status=published`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminRealStatesPublishedIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const realstates = await getRealStates(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/realstates/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/realstates/published?page=${page}&limit=${limit}&sort=${sort}`
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
					objects={realstates}
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

export default AdminRealStatesPublishedIndex;
