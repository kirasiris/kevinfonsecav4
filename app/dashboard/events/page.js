import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import List from "@/components/dashboard/events/list";

async function getEvents(params) {
	const res = await fetchurl(`/global/events${params}`, "GET", "no-cache");
	return res;
}

const DashboardEventsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const events = await getEvents(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}&decrypt=true`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/events/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/events/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/events?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<div className="card rounded-0">
			<List
				stripeChargesEnabled={auth?.userStripeChargesEnabled}
				allLink="/dashboard/events"
				pageText="Events"
				addLink="/dashboard/events/create"
				searchOn="/dashboard/events"
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
	);
};

export default DashboardEventsIndex;
