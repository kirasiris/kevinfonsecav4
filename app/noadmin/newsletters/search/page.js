import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/newsletters/list";
import { revalidatePath } from "next/cache";

async function getNewsletters(params) {
	const res = await fetchurl(`/newsletters${params}`, "GET", "no-cache");
	return res;
}

const AdminNewslettersSearchIndex = async ({ params, searchParams }) => {
	const newsletters = await getNewsletters(
		`?keyword=${searchParams.keyword}&page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=${searchParams.sort || "-createdAt"}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/newsletters/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/newsletters/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
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

export default AdminNewslettersSearchIndex;
