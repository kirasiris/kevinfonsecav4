import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/videos/list";
import { revalidatePath } from "next/cache";

async function getVideos(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

const AdminVideosSearchIndex = async ({ params, searchParams }) => {
	const videos = await getVideos(
		`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Playlist`
		);
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
					objects={videos}
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

export default AdminVideosSearchIndex;
