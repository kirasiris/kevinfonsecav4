import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/polls/list";
import { revalidatePath } from "next/cache";

async function getPolls(params) {
	const res = await fetchurl(`/polls${params}`, "GET", "no-cache");
	return res;
}

const AdminPollsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const polls = await getPolls(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/deleteall`, "PUT", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/polls/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/polls"
				publishedLink="/noadmin/polls/published"
				draftLink="/noadmin/polls/draft"
				scheduledLink="/noadmin/polls/scheduled"
				trashedLink="/noadmin/polls/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/polls"
					pageText="Polls"
					addLink="/noadmin/polls/create"
					searchOn="/noadmin/polls"
					objects={polls}
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

export default AdminPollsIndex;