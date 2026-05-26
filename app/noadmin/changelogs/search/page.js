import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/changelogs/list";

async function getChangelogs(params) {
	const res = await fetchurl(`/global/changelogs${params}`, "GET", "no-cache");
	return res;
}

const AdminChangelogsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const changelogs = await getChangelogs(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/changelogs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/changelogs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/changelogs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/changelogs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/changelogs/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/changelogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/changelogs/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/changelogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
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
					searchedKeyword={keyword}
					objects={changelogs}
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

export default AdminChangelogsSearchIndex;
