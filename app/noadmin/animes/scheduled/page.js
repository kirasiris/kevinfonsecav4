import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/animes/list";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/global/playlists${params}&onairtype=anime&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminAnimesScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const animes = await getPlaylists(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/playlists/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/playlists/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/animes/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/animes"
				publishedLink="/noadmin/animes/published"
				draftLink="/noadmin/animes/draft"
				scheduledLink="/noadmin/animes/scheduled"
				trashedLink="/noadmin/animes/trashed"
				categoriesLink="/noadmin/animes/categories"
				categoryType="anime"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/animes"
					pageText="Animes"
					addLink="/noadmin/animes/create"
					searchOn="/noadmin/animes"
					objects={animes}
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

export default AdminAnimesScheduledIndex;
