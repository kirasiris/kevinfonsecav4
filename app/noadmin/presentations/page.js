import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/presentations/list";

async function getPresentations(params) {
	const res = await fetchurl(
		`/global/presentations${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminPresentationsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const presentations = await getPresentations(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/presentations/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/presentations/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/presentations/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/${id}/scheduleit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/presentations/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/${id}/unfeatureit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/presentations/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/presentations"
				publishedLink="/noadmin/presentations/published"
				draftLink="/noadmin/presentations/draft"
				scheduledLink="/noadmin/presentations/scheduled"
				trashedLink="/noadmin/presentations/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/presentations"
					pageText="Presentations"
					addLink="/noadmin/presentations/create"
					searchOn="/noadmin/presentations"
					searchedKeyword=""
					objects={presentations}
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

export default AdminPresentationsIndex;
