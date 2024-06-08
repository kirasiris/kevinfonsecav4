import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/playlists/list";
import { revalidatePath } from "next/cache";

async function getPlaylists(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

const AdminPlaylistsScheduledIndex = async ({ params, searchParams }) => {
	const playlists = await getPlaylists(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&status=scheduled`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/playlists"
				publishedLink="/noadmin/playlists/published"
				draftLink="/noadmin/playlists/draft"
				scheduledLink="/noadmin/playlists/scheduled"
				trashedLink="/noadmin/playlists/trashed"
				categoriesLink="/noadmin/playlists/categories"
				categoryType="playlist"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/playlists"
					pageText="Playlists"
					addLink="/noadmin/playlists/create"
					searchOn="/noadmin/playlists"
					objects={playlists}
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

export default AdminPlaylistsScheduledIndex;
