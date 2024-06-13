import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/snippets/list";
import { revalidatePath } from "next/cache";

async function getSnippets(params) {
	const res = await fetchurl(
		`/snippets${params}&status=trash`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminSnippetsTrashedIndex = async ({ params, searchParams }) => {
	const snippets = await getSnippets(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/snippets/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/snippets/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
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
					objects={snippets}
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

export default AdminSnippetsTrashedIndex;
