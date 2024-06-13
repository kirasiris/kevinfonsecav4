import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/secrets/list";
import { revalidatePath } from "next/cache";
import Form from "./form";

async function getSecrets(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res;
}

const AdminSecretsIndex = async ({ params, searchParams }) => {
	const secrets = await getSecrets(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/secrets/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
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
			`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
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
				searchParams={searchParams}
				revalidateUrl={`/noadmin/secrets?page=${searchParams.page || 1}&limit=${
					searchParams.limit || 10
				}&sort=${searchParams.sort || "-createdAt"}`}
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

export default AdminSecretsIndex;
