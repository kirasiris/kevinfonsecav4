import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/videos/list";
import { revalidatePath } from "next/cache";

async function getVideos(params) {
	const res = await fetchurl(
		`/videos${params}&onModel=Playlist`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminVideosSearchIndex = async ({ params, searchParams }) => {
	const videos = await getVideos(
		`?keyword=${searchParams.keyword}&page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=${searchParams.sort || "-createdAt"}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/videos/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
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
