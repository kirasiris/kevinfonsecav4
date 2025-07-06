import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/polls/list";

async function getPolls(params) {
	const res = await fetchurl(
		`/global/polls${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminPollsScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const polls = await getPolls(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/polls/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/polls/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/polls/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
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
					searchedKeyword=""
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

export default AdminPollsScheduledIndex;
