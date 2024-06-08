import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/secrets/list";
import { revalidatePath } from "next/cache";

async function getSecrets(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res;
}

const AdminSecretsSearchIndex = async ({ params, searchParams }) => {
	const secrets = await getSecrets(
		`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/secrets/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/secrets"
				publishedLink="/noadmin/secrets/published"
				draftLink="/noadmin/secrets/draft"
				scheduledLink="/noadmin/secrets/scheduled"
				trashedLink="/noadmin/secrets/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/secrets"
					pageText="Secrets"
					addLink="/noadmin/secrets/create"
					searchOn="/noadmin/secrets"
					objects={secrets}
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

export default AdminSecretsSearchIndex;
