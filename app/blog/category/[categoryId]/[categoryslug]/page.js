import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/blog/list";

async function getFeaturedBlog(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/blogs${params}`);
	return res.json();
}

async function getBlogs(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/blogs${params}`);
	return res.json();
}

async function getCategories(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/categories${params}`
	);
	return res.json();
}

async function getQuotes() {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/extras/quotes/random`
	);
	return res.json();
}

const BlogCategoryIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published${decrypt}`
	);

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=blog&status=published&category=${params.categoryid}${decrypt}`
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
				title="Welcome to my Blog"
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