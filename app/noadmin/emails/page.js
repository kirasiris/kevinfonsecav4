import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/emails/list";
import { revalidatePath } from "next/cache";

async function getEmails(params) {
	const res = await fetchurl(`/emails${params}`, "GET", "no-cache");
	return res;
}

const AdminEmailsIndex = async ({ params, searchParams }) => {
	const emails = await getEmails(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/emails?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/emails"
				publishedLink="/noadmin/emails/published"
				draftLink="/noadmin/emails/draft"
				scheduledLink="/noadmin/emails/scheduled"
				trashedLink="/noadmin/emails/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/emails"
					pageText="Emails"
					addLink="/noadmin/emails/create"
					searchOn="/noadmin/emails"
					objects={emails}
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

export default AdminEmailsIndex;
