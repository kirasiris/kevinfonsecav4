import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/video/list";

async function getPlaylists(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const PlaylistIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 32;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getPlaylistsData = getPlaylists(
		`?page=${page}&limit=${limit}&sort=-createdAt&playlistType=video&status=published&keyword=${searchParams.keyword}${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=playlist`);

	const [playlists, categories] = await Promise.all([
		getPlaylistsData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List
				objects={playlists}
				searchParams={searchParams}
				categories={categories}
			/>
		</>
	);
};

export default PlaylistIndex;
