import { fetchurl } from "@/helpers/setTokenOnServer";
import Single from "@/components/blog/single";
import Header from "@/layout/header";
import Sidebar from "@/layout/sidebar";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";

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
	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published`
	);
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=blog&status=published&category=${params.categoryid}`
	);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [featured, blogs, categories, quotes] = await Promise.all([
		getFeaturedBlogsData,
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	const nextPage = blogs?.pagination?.next?.page || 0;
	const prevPage = blogs?.pagination?.prev?.page || 0;

	return (
		<>
			<Header
				title="Welcome to my Blog"
				description="Learn everything about my programming and life journey"
			/>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						{/* Featured list */}
						{featured?.data?.length > 0 &&
							featured.data.map((featured) => (
								<Single key={featured._id} blog={featured} fullWidth={true} />
							))}
						{/* Blog list */}
						<div className="row">
							{blogs?.data?.length > 0 ? (
								<>
									{blogs.data?.map((blog) => (
										<Single key={blog._id} blog={blog} />
									))}
									<NumericPagination
										totalPages={
											blogs?.pagination?.totalpages ||
											Math.ceil(blogs?.data?.length / searchParams.limit)
										}
										page={searchParams.page}
										limit={searchParams.limit}
										sortby="-createdAt"
										siblings={1}
										postType="blog"
									/>
								</>
							) : (
								<NothingFoundAlert />
							)}
						</div>
					</div>
					<div className="col-lg-4">
						<Sidebar quotes={quotes} categories={categories} />
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogCategoryIndex;
