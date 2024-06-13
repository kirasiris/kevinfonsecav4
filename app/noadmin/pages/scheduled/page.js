import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/pages/list";
import { revalidatePath } from "next/cache";

async function getPages(params) {
	const res = await fetchurl(
		`/pages${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminPagesScheduledIndex = async ({ params, searchParams }) => {
	const pages = await getPages(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/pages/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/pages"
				publishedLink="/noadmin/pages/published"
				draftLink="/noadmin/pages/draft"
				scheduledLink="/noadmin/pages/scheduled"
				trashedLink="/noadmin/pages/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/pages"
					pageText="Pages"
					addLink="/noadmin/pages/create"
					searchOn="/noadmin/pages"
					objects={pages}
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

export default AdminPagesScheduledIndex;
