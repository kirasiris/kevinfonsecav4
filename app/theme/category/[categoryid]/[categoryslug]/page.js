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

const ThemeCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const postType = awtdSearchParams.postType || "theme";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedThemesData = getFeaturedTheme(
		`?featured=true&postType=${postType}&status=published${decrypt}`
	);

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published&category=${awtdParams.categoryid}${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=theme`);

	const [featured, themes, categories] = await Promise.all([
		getFeaturedThemesData,
		getThemesData,
		getCategoriesData,
	]);

	const capitalizeWord = awtdParams.categoryslug;

	return (
		<>
			<Header
				title={`Welcome to my ${capitalizeWord
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")} Portfolios`}
				description="Check my projects out and tell me what you think!"
			/>
			<List
				featured={featured}
				objects={themes}
				searchParams={awtdSearchParams}
				categories={categories}
			/>
		</>
	);
};

export default ThemeCategoryIndex;
