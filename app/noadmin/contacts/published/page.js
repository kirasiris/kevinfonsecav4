import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/contacts/list";
import { revalidatePath } from "next/cache";

async function getContacts(params) {
	const res = await fetchurl(`/contacts${params}`, "GET", "no-cache");
	return res;
}

const AdminContactsPublishedIndex = async ({ params, searchParams }) => {
	const contacts = await getContacts(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/contacts/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=published`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/contacts"
				publishedLink="/noadmin/contacts/published"
				draftLink="/noadmin/contacts/draft"
				scheduledLink="/noadmin/contacts/scheduled"
				trashedLink="/noadmin/contacts/trashed"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/contacts"
					pageText="Contacts"
					addLink="/noadmin/contacts/create"
					searchOn="/noadmin/contacts"
					objects={contacts}
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

export default AdminContactsPublishedIndex;
