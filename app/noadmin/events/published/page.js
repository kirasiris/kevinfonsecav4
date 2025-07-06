import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/events/list";

async function getEvents(params) {
	const res = await fetchurl(
		`/global/events${params}&status=published`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminEventsPublishededIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const events = await getEvents(
		`?page=${page}&limit=${limit}&sort=${sort}&decrypt=true`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/events/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/events/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/events/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/events"
				publishedLink="/noadmin/events/published"
				draftLink="/noadmin/events/draft"
				scheduledLink="/noadmin/events/scheduled"
				trashedLink="/noadmin/events/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/events"
					pageText="Events"
					addLink="/noadmin/events/create"
					searchOn="/noadmin/events"
					searchedKeyword=""
					objects={events}
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

export default AdminEventsPublishededIndex;
