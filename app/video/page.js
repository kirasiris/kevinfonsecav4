import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/video/list";

async function getPlaylists(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const PlaylistIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const limit = awtdSearchParams.limit || 32;
	const page = awtdSearchParams.page || 1;
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getPlaylistsData = getPlaylists(
		`?page=${page}&limit=${limit}&sort=-createdAt&playlistType=video&status=published${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=playlist`);

	const [playlists, categories] = await Promise.all([
		getPlaylistsData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Movies"
				description="Here you will see everything I'm currently watching!"
			/>
			<List
				objects={playlists}
				searchParams={awtdSearchParams}
				categories={categories}
			/>
		</>
	);
};

export default PlaylistIndex;
