import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/reports/list";
import { revalidatePath } from "next/cache";

async function getReports(params) {
	const res = await fetchurl(`/reports${params}`, "GET", "no-cache");
	return res;
}

const AdminReportsIndex = async ({ params, searchParams }) => {
	const reports = await getReports(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/reports/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/reports?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/reports"
				publishedLink="/noadmin/reports/published"
				draftLink="/noadmin/reports/draft"
				scheduledLink="/noadmin/reports/scheduled"
				trashedLink="/noadmin/reports/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/reports"
					pageText="Reports"
					addLink="/noadmin/reports/create"
					searchOn="/noadmin/reports"
					objects={reports}
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

export default AdminReportsIndex;
