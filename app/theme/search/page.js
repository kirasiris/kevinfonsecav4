import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/theme/list";

async function getFeaturedTheme(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");
	return res;
}

async function getThemes(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");

	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const ThemeSearchIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const postType = searchParams.postType || "theme";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedThemesData = getFeaturedTheme(
		`?featured=true&postType=${postType}&status=published${decrypt}`
	);

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published&keyword=${searchParams.keyword}${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=theme`);

	const [featured, themes, categories] = await Promise.all([
		getFeaturedThemesData,
		getThemesData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List
				featured={featured}
				objects={themes}
				searchParams={searchParams}
				categories={categories}
			/>
		</>
	);
};

export default ThemeSearchIndex;
