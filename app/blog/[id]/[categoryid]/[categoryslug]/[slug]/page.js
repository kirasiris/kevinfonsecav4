import { Suspense } from "react";
import { notFound } from "next/navigation";
// import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/blog/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getBlog(params) {
	const res = await fetchurl(`/blogs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
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
						<Globalcontent
							containerClasses={`col-lg-${blog.data.fullWidth ? "12" : "8"}`}
						>
							<article>
								<ArticleHeader
									object={blog}
									url={`/blog/category/${blog?.data?.category?._id}/${blog?.data?.category?.slug}`}
								/>
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
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										{blog?.data?.category && (
											<ExportModal
												linkToShare={`/blog/${blog?.data?._id}/${blog?.data?.category?._id}/${blog?.data?.category.slug}/${blog?.data?.slug}`}
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
										auth={auth?.data}
										postId={blog?.data?._id}
										secondPostId={blog?.data?._id}
										parentId={undefined}
										isVisible={blog?.data?.commented}
										postType="blog"
										onModel="Blog"
									/>
								</section>
							</article>
						</Globalcontent>
						{blog.data.fullWidth !== true && (
							<Sidebar quotes={quotes} categories={categories} />
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
