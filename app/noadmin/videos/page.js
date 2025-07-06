import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/videos/list";

async function getVideos(params) {
	const res = await fetchurl(
		`/global/videos${params}&onModel=Playlist`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminVideosIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const videos = await getVideos(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/videos/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/videos?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/videos"
				publishedLink="/noadmin/videos/published"
				draftLink="/noadmin/videos/draft"
				scheduledLink="/noadmin/videos/scheduled"
				trashedLink="/noadmin/videos/trashed"
				categoriesLink="/noadmin/videos/categories"
				categoryType="video"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/videos"
					pageText="Videos"
					addLink="/noadmin/videos/create"
					searchOn="/noadmin/videos"
					searchedKeyword=""
					objects={videos}
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

export default AdminVideosIndex;
