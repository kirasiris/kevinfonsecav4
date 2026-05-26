import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/movies/list";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/global/playlists${params}&onairtype=movie`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminMoviesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const movies = await getPlaylists(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/playlists/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/playlists/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/playlists/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/movies/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/movies"
				publishedLink="/noadmin/movies/published"
				draftLink="/noadmin/movies/draft"
				scheduledLink="/noadmin/movies/scheduled"
				trashedLink="/noadmin/movies/trashed"
				categoriesLink="/noadmin/movies/categories"
				categoryType="movie"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/movies"
					pageText="Movies"
					addLink="/noadmin/movies/create"
					searchOn="/noadmin/movies"
					searchedKeyword={keyword}
					objects={movies}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
					handleTrash={trashIt}
					handleSchedule={scheduleIt}
					handleFeature={featureIt}
					handleUnfeature={unfeatureIt}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminMoviesIndex;
