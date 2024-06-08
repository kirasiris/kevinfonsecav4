import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/newsletters/list";
import { revalidatePath } from "next/cache";

async function getNewsletters(params) {
	const res = await fetchurl(`/newsletters${params}`, "GET", "no-cache");
	return res;
}

const AdminNewslettersIndex = async ({ params, searchParams }) => {
	const newsletters = await getNewsletters(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/newsletters"
				publishedLink="/noadmin/newsletters/published"
				draftLink="/noadmin/newsletters/draft"
				scheduledLink="/noadmin/newsletters/scheduled"
				trashedLink="/noadmin/newsletters/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newsletters"
					pageText="Newsletters"
					addLink="/noadmin/newsletters/create"
					searchOn="/noadmin/newsletters"
					objects={newsletters}
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

export default AdminNewslettersIndex;
