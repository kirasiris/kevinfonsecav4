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

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getCategories(params) {
	const res = await fetch(`http://localhost:5000/api/v1/categories${params}`);

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getQuotes() {
	const res = await fetch(`http://localhost:5000/api/v1/extras/quotes/random`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const BlogIndex = async ({ params, searchParams }) => {
	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published`
	);
	const getBlogsData = getBlogs(
		`?page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=-createdAt&postType=blog&status=published`
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
						{featured.data.map((featured, index) => (
							<Single key={featured._id} blog={featured} />
						))}
						{/* Blog list */}
						<div className="row">
							<NumericPagination
								nextParams={`?page=${
									blogs?.pagination?.next?.page || 0
								}&limit=${searchParams.limit}`}
								prevParams={`?page=${
									blogs?.pagination?.prev?.page || 0
								}&limit=${searchParams.limit}`}
								next={blogs?.pagination?.next?.page || 0}
								prev={blogs?.pagination?.prev?.page || 0}
								loadMoreParams={`blog`}
								pageArray={blogs?.pagination?.pages}
								pagePath="/blog"
								pageParams={searchParams}
								componentMapping={blogs.data.map((blog, index) => (
									<div key={blog._id} className={`col-lg-6 ${index}`}>
										<Single
											blog={blog}
											imageWidth={`415`}
											imageHeight={`207`}
										/>
									</div>
								))}
							/>
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
