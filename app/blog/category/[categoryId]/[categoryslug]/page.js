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

const BlogCategoryIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const postType = searchParams.postType || "blog";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=${postType}&status=published${decrypt}`
	);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=${sort}&postType=${postType}&status=published&category=${params.categoryid}${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [featured, blogs, categories, quotes] = await Promise.all([
		getFeaturedBlogsData,
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	const capitalizeWord = params.categoryslug;

	return (
		<>
			<Header
				title={`Welcome to my ${capitalizeWord
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")} Blogs`}
				description="Learn everything about my programming and life journey"
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

export default BlogCategoryIndex;
