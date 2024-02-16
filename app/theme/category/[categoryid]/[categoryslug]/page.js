import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/theme/list";

async function getFeaturedTheme(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/themes${params}`);
	return res.json();
}

async function getThemes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/themes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getCategories(params) {
	const res = await fetch(`http://localhost:5000/api/v1/categories${params}`);

	return res.json();
}

const ThemeCategoryIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedThemesData = getFeaturedTheme(
		`?featured=true&postType=theme&status=published${decrypt}`
	);

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=theme&status=published&category=${params.categoryid}${decrypt}`
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
				title="Welcome to my Portfolio"
				description="Check my projects out and tell me what you think!"
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

export default ThemeCategoryIndex;
