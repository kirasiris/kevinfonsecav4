import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/cdalbums/list";
import { revalidatePath } from "next/cache";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/playlists${params}&onairtype=cd-album&status=trash`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCDAlbumsTrashedIndex = async ({ params, searchParams }) => {
	const cdalbums = await getPlaylists(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/playlists/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/trashed?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/cdalbums"
				publishedLink="/noadmin/cdalbums/published"
				draftLink="/noadmin/cdalbums/draft"
				scheduledLink="/noadmin/cdalbums/scheduled"
				trashedLink="/noadmin/cdalbums/trashed"
				categoriesLink="/noadmin/cdalbums/categories"
				categoryType="song"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/cdalbums"
					pageText="CD Albums"
					addLink="/noadmin/cdalbums/create"
					searchOn="/noadmin/cdalbums"
					objects={cdalbums}
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

export default AdminCDAlbumsTrashedIndex;
