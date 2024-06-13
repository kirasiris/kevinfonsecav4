import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/changelogs/list";

async function getChangelogs(params) {
	const res = await fetchurl(`/changelogs${params}`, "GET", "no-cache");
	return res;
}

const AdminChangelogsSearchIndex = async ({ params, searchParams }) => {
	const changelogs = await getChangelogs(
		`?keyword=${searchParams.keyword}&page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=${searchParams.sort || "-createdAt"}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/changelogs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/changelogs?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/changelogs"
				publishedLink="/noadmin/changelogs/published"
				draftLink="/noadmin/changelogs/draft"
				scheduledLink="/noadmin/changelogs/scheduled"
				trashedLink="/noadmin/changelogs/trashed"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/changelogs"
					pageText="Changelogs"
					addLink="/noadmin/changelogs"
					searchOn="/noadmin/changelogs"
					objects={changelogs}
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

export default AdminChangelogsSearchIndex;
