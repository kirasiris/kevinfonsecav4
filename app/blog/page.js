import Single from "@/components/blog/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Sidebar from "@/layout/sidebar";
import Head from "@/app/head";
import NumericPagination from "@/layout/numericpagination";

async function getFeaturedBlog(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getCategories(params) {
	const res = await fetch(`http://localhost:5000/api/v1/categories${params}`);

	return res.json();
}

async function getQuotes() {
	const res = await fetch(`http://localhost:5000/api/v1/extras/quotes/random`, {
		cache: "no-store",
	});

	return res.json();
}

const BlogIndex = async ({ params, searchParams }) => {
	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published`
	);
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getBlogsData = getBlogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&postType=blog&status=published`
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
			<Head
				title="Welcome to my Blog!"
				description="Learn everything about my programming and life journey"
			/>
			<Header
				title="Welcome to my Blog"
				description="Learn everything about my programming and life journey"
			/>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						{/* Featured list */}
						{featured?.data?.length > 0 &&
							featured.data.map((featured, index) => (
								<Single key={featured._id} blog={featured} />
							))}
						{/* Blog list */}
						<div className="row">
							{blogs?.data?.length > 0 && (
								<NumericPagination
									nextParams={`/blog?page=${nextPage}&limit=${limit}`}
									prevParams={`/blog?page=${prevPage}&limit=${limit}`}
									next={nextPage}
									prev={prevPage}
									loadMoreParams={`blog`}
									pagesArrayInfo={blogs?.pagination}
									pagePath="/blog"
									pageParams={searchParams}
									componentMapping={blogs.data?.map((blog, index) => (
										<div key={blog._id} className={`col-lg-6 ${index}`}>
											<Single
												blog={blog}
												imageWidth={`415`}
												imageHeight={`207`}
											/>
										</div>
									))}
								/>
							)}
						</div>
					</div>
					<div className="col-lg-4">
						<Sidebar quotes={quotes} categories={categories} />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default BlogIndex;
