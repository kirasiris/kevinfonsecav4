import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getBlog(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/blogs${params}`);

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

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

const BlogRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getBlogsData = getBlog(`/${params.id}`);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [blog, categories, quotes] = await Promise.all([
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={blog.data.title} />
			<div className="container">
				{blog.data.status === "published" || searchParams.isAdmin === "true" ? (
					<div className="row">
						<div className={`col-lg-${blog.data.fullWidth ? "12" : "8"}`}>
							<article>
								<header className="mb-4">
									<h1>{blog.data.title}</h1>
									<div className="text-muted fst-italic mb-2">
										Posted on {blog.data.createdAt} by {blog.data.user.username}
									</div>
									{blog.data.category && (
										<Link
											href={{
												pathname: `/blog/category/${blog.data.category._id}/${blog.data.category.slug}`,
												query: {
													page: 1,
													limit: 10,
												},
											}}
											passHref
											legacyBehavior
										>
											<a className="badge bg-secondary text-decoration-none link-light">
												{blog.data.category.title}
											</a>
										</Link>
									)}
								</header>
								<figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											blog?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${blog?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure>
								<section className="mb-5">
									<ParseHtml text={blog?.data?.text} />
									<hr />
									<div className="float-start">
										{blog?.data?.category && (
											<ExportModal
												linkToShare={`localhost:3000/blog/${blog?.data?._id}/${blog?.data?.category?._id}/${blog?.data?.category.slug}/${blog?.data?.slug}`}
												object={blog?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											postId={blog?.data?._id}
											postType="blog"
											onModel="Blog"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={blog?.data?.user} />
									<CommentBox
										auth={auth.data}
										user={blog?.data?.user}
										postId={blog?.data?._id}
										secondPostId={blog?.data?._id}
										isVisible={blog?.data?.commented}
										postType="blog"
										onModel="Blog"
									/>
								</section>
							</article>
						</div>
						{blog.data.fullWidth !== true && (
							<div className="col-lg-4">
								<Sidebar quotes={quotes} categories={categories} />
							</div>
						)}
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default BlogRead;
