import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import List from "@/components/dashboard/forums/list";

async function getForums(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	return res;
}

const DashboardForumsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const forums = await getForums(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/forums/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/forums/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/forums?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<div className="card rounded-0">
			<List
				stripeChargesEnabled={auth?.userStripeChargesEnabled}
				allLink="/dashboard/forums"
				pageText="Forums"
				addLink="/dashboard/forums/create"
				searchOn="/dashboard/forums"
				searchedKeyword=""
				objects={forums}
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

export default DashboardForumsIndex;
