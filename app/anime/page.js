import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/anime/list";

async function getFeaturedAnime(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getAnimes(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

async function getQuotes() {
	const res = await fetchurl(`/extras/quotes/random`, "GET", "no-cache");
	return res;
}

const AnimeIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedAnimesData = getFeaturedAnime(
		`?featured=true&onairtype=anime&status=published${decrypt}`
	);

	const getAnimesData = getAnimes(
		`?page=${page}&limit=${limit}&sort=-createdAt&onairtype=anime&status=published${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=playlist`);

	const getQuotesData = getQuotes();

	const [featured, animes, categories, quotes] = await Promise.all([
		getFeaturedAnimesData,
		getAnimesData,
		getCategoriesData,
		getQuotesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Animes page"
				description="Learn everything about my programming and life journey"
			/>
			<List
				featured={featured}
				objects={animes}
				searchParams={searchParams}
				categories={categories}
			/>
		</>
	);
};

export default AnimeIndex;