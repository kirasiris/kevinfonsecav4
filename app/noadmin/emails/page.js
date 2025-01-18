import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/emails/list";
import { revalidatePath } from "next/cache";

async function getEmails(params) {
	const res = await fetchurl(`/emails${params}`, "GET", "no-cache");
	return res;
}

const AdminEmailsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const emails = await getEmails(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/emails?page=${page}&limit=${limit}&sort=${sort}`);
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

export default AdminEmailsIndex;
