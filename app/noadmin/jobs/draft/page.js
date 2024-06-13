import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/jobs/list";
import { revalidatePath } from "next/cache";

async function getJobs(params) {
	const res = await fetchurl(`/jobs${params}&status=draft`, "GET", "no-cache");
	return res;
}

const AdminJobsDraftIndex = async ({ params, searchParams }) => {
	const jobs = await getJobs(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/jobs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/jobs/draft?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/jobs"
				publishedLink="/noadmin/jobs/published"
				draftLink="/noadmin/jobs/draft"
				scheduledLink="/noadmin/jobs/scheduled"
				trashedLink="/noadmin/jobs/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/jobs"
					pageText="Jobs"
					addLink="/noadmin/jobs/create"
					searchOn="/noadmin/jobs"
					objects={jobs}
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

export default AdminJobsDraftIndex;
