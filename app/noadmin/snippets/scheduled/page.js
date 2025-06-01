import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/snippets/list";

async function getSnippets(params) {
	const res = await fetchurl(
		`/global/snippets${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminSnippetsScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const snippets = await getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/snippets/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/snippets/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/snippets/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/snippets"
				publishedLink="/noadmin/snippets/published"
				draftLink="/noadmin/snippets/draft"
				scheduledLink="/noadmin/snippets/scheduled"
				trashedLink="/noadmin/snippets/trashed"
				categoriesLink="/noadmin/snippets/categories"
				categoryType="snippet"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/snippets"
					pageText="Snippets"
					addLink="/noadmin/snippets/create"
					searchOn="/noadmin/snippets"
					searchedKeyword=""
					objects={snippets}
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

export default AdminSnippetsScheduledIndex;
