import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/newsletteremails/list";
import { revalidatePath } from "next/cache";

async function getNewsletterEmails(params) {
	const res = await fetchurl(
		`/newsletteremails${params}&status=trash`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminNewsletterEmailsTrashedIndex = async ({ params, searchParams }) => {
	const newsletteremails = await getNewsletterEmails(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletteremails/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/newsletteremails/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/newsletteremails/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/newsletteremails"
				publishedLink="/noadmin/newsletteremails/published"
				draftLink="/noadmin/newsletteremails/draft"
				scheduledLink="/noadmin/newsletteremails/scheduled"
				trashedLink="/noadmin/newsletteremails/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newsletteremails"
					pageText="Newsletter Emails"
					addLink="/noadmin/newsletteremails/create"
					searchOn="/noadmin/newsletteremails"
					objects={newsletteremails}
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

export default AdminNewsletterEmailsTrashedIndex;
