import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/blog/list";

async function getFeaturedBlog(params) {
	const res = await fetchurl(`/blogs${params}`, "GET", "no-cache");
	return res;
}

async function getBlogs(params) {
	const res = await fetchurl(`/blogs${params}`, "GET", "no-cache");
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

const BlogSearchIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published${decrypt}`
	);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=blog&status=published&keyword=${searchParams.keyword}${decrypt}`
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
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List
				featured={featured}
				objects={blogs}
				searchParams={searchParams}
				categories={categories}
				quotes={quotes}
			/>
		</>
	);
};

export default BlogSearchIndex;
