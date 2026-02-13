import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/blog/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getBlogs(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getQuotes() {
	const res = await fetchurl(`/global/quotes/random`, "GET", "no-cache");
	return res;
}

const BlogIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const postType = awtdSearchParams.postType || "blog";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedBlogsData = getBlogs(
		`?featured=true&postType=blog&status=published${decrypt}`,
	);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published${decrypt}`,
	);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [featured, blogs, categories, quotes] = await Promise.all([
		getFeaturedBlogsData,
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Blog`}
				description={"Learn everything about my programming and life journey"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/blog`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title="Welcome to my Blog"
				description="Learn everything about my programming and life journey"
			/>
			<List
				featured={featured}
				objects={blogs}
				searchParams={awtdSearchParams}
				categories={categories}
				quotes={quotes}
			/>
		</>
	);
};

export default BlogIndex;
