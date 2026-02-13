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

const BlogCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const postType = awtdSearchParams.postType || "blog";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedBlogsData = getBlogs(
		`?featured=true&postType=${postType}&status=published${decrypt}`,
	);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published&category=${awtdParams.categoryid}${decrypt}`,
	);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [featured, blogs, categories, quotes] = await Promise.all([
		getFeaturedBlogsData,
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	const capitalizeWord = awtdParams.categoryslug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${capitalizeWord}`}
				description={`${capitalizeWord} search results`}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/blog/category/${awtdParams.categoryid}/${awtdParams.categoryslug}?page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title={`Welcome to my ${capitalizeWord} Blogs`}
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

export default BlogCategoryIndex;
