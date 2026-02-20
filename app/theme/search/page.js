import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/theme/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getThemes(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");

	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const ThemeSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const postType = awtdSearchParams.postType || "theme";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedThemesData = getThemes(
		`?featured=true&postType=${postType}&status=published${decrypt}`,
	);

	const getThemesData = getThemes(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`,
	);

	const getCategoriesData = getCategories(`?categoryType=theme`);

	const [featured, themes, categories] = await Promise.all([
		getFeaturedThemesData,
		getThemesData,
		getCategoriesData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${awtdSearchParams.keyword}`}
				description={"Search results..."}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/theme/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title={`${awtdSearchParams.keyword}`}
						description="Search results..."
					/>
					<List
						featured={featured}
						objects={themes}
						searchParams={awtdSearchParams}
						categories={categories}
					/>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ThemeSearchIndex;
