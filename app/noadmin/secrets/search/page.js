import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/secrets/list";
import Form from "../form";

async function getSecrets(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res;
}

const AdminSecretsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const secrets = await getSecrets(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/secrets/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			<Form
				searchParams={awtdSearchParams}
				revalidateUrl={`/noadmin/secrets/search?keyword=${
					awtdSearchParams.keyword
				}&page=${awtdSearchParams.page || 1}&limit=${
					awtdSearchParams.limit || 10
				}&sort=${awtdSearchParams.sort || "-createdAt"}`}
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/secrets"
					pageText="Secrets"
					addLink="/noadmin/secrets/create"
					searchOn="/noadmin/secrets"
					objects={secrets}
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

export default AdminSecretsSearchIndex;
