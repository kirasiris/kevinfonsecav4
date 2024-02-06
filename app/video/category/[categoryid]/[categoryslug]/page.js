import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/video/list";

async function getPlaylists(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/playlists${params}`);
	return res.json();
}

async function getCategories(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/categories${params}`
	);
	return res.json();
}

const PlaylistIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 32;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getPlaylistsData = getPlaylists(
		`?page=${page}&limit=${limit}&sort=-createdAt&playlistType=video&status=published&category=${params.categoryid}${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=playlist`);

	const [playlists, categories] = await Promise.all([
		getPlaylistsData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title={`Welcome to my Movies`}
				description="Here you will see everything I'm currently watching!"
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
