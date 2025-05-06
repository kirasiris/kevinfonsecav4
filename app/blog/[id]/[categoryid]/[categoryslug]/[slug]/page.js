import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import Header from "@/layout/header";
import Sidebar from "@/layout/blog/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import Head from "@/app/head";
import CommentBox from "@/components/global/commentbox";
import CommentForm from "@/components/global/commentform";

async function getBlog(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getQuotes() {
	const res = await fetchurl(`/extras/quotes/random`, "GET", "no-cache");
	return res;
}

const BlogRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getUserOnServer();

	const getBlogsData = getBlog(`/${awtdParams.id}`);

	const getCommentsData = getComments(
		`?resourceId=${awtdParams.id}&status=published&decrypt=true`
	);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [blog, comments, categories, quotes] = await Promise.all([
		getBlogsData,
		getCommentsData,
		getCategoriesData,
		getQuotesData,
	]);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/blog/${blog?.data?._id}/${blog?.data?.category?._id}/${blog?.data?.category?.slug}/${blog?.data?.slug}`
		);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={blog.data.title}
				description={blog.data.excerpt || blog.data.text}
				// favicon=""
				postImage={blog.data.files.avatar.location.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category={blog.data.category.title}
				url={`/blog/${blog.data._id}/${blog.data.category._id}/${blog.data.category.slug}/${blog.data.slug}`}
				author={blog.data.user.name}
				createdAt={blog.data.createdAt}
				updatedAt={blog.data.updatedAt}
				locales=""
				posType="blog"
			/>
			<Header title={blog.data.title} />
			<div className="container">
				{blog.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent
							containerClasses={`col-lg-${blog?.data?.fullWidth ? "12" : "8"}`}
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
											resourceId={blog?.data?._id}
											postType="blog"
											onModel="Blog"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={blog?.data?.user} />
									{blog?.data?.commented ? (
										<>
											<CommentForm
												auth={auth}
												resourceId={blog?.data?._id}
												parentId={undefined}
												returtopageurl={`/blog/${blog?.data?._id}/${blog?.data?.category?._id}/${blog?.data?.category?.slug}/${blog?.data?.slug}`}
												onModel="Blog"
												objects={comments}
											/>
											<CommentBox
												auth={auth}
												allLink={`/comment?resourceId=${blog?.data?._id}&page=1&limit=10&sort=-createdAt&status=published`}
												pageText="Comments"
												objects={comments}
												searchParams={awtdSearchParams}
												handleDraft={undefined}
												handlePublish={undefined}
												handleTrash={undefined}
												handleSchedule={undefined}
												handleDelete={handleDelete}
												handleTrashAllFunction={undefined}
												handleDeleteAllFunction={undefined}
												displayPagination={false}
												isChildCommment={false}
											/>
										</>
									) : (
										<div className="alert alert-danger">
											Comments are closed
										</div>
									)}
								</section>
							</article>
						</Globalcontent>
						{blog?.data?.fullWidth !== true && (
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
