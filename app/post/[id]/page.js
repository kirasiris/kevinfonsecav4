import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/blog/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/myfinalcommentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import MyFinalCommentForm from "@/components/global/myfinalcommentform";
import DisqusComments from "@/components/global/disquscomments";
import { revalidatePath } from "next/cache";

async function getPost(params) {
	const res = await fetchurl(`/posts${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

const PostRead = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 15;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getPostsData = getPost(`/${params.id}`);

	const getCommentsData = getComments(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`
	);

	const [blog, comments] = await Promise.all([getPostsData, getCommentsData]);

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
			<Header title={blog.data.title} />
			<div className="container">
				{blog.data.status === "published" || searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-12`}>
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
										<ExportModal
											linkToShare={`/post/${blog?.data?._id}`}
											object={blog?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={blog?.data?._id}
											postType="post"
											onModel="Post"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={blog?.data?.user} />
									<div className="comments">
										<DisqusComments
											auth={auth}
											object={blog}
											returtopageurl={`/post/${blog?.data?._id}`}
										/>
										{blog?.data?.commented ? (
											<>
												{auth?.userId ? (
													<MyFinalCommentForm
														resourceId={blog?.data?._id}
														parentId={undefined}
														returtopageurl={`/post/${blog?.data?._id}`}
														postType="post"
														onModel="Post"
													/>
												) : (
													<div className="alert alert-info">
														<Link
															href={{
																pathname: `/auth/login`,
																query: {
																	returnpage: `/blog/${blog?.data?._id}/${blog?.data?.category?._id}/${blog?.data?.category.slug}/${blog?.data?.slug}`,
																},
															}}
															passHref
															legacyBehavior
														>
															<a>You need to login first</a>
														</Link>
													</div>
												)}
												<CommentBox
													auth={auth}
													allLink={`/comment?resourceId=${blog?.data?._id}&page=1&limit=15&sort=-createdAt&status=published`}
													pageText="Comments"
													objects={comments}
													searchParams={searchParams}
													handleDraft={undefined}
													handlePublish={undefined}
													handleTrash={undefined}
													handleSchedule={undefined}
													handleDelete={handleDelete}
													handleTrashAllFunction={undefined}
													handleDeleteAllFunction={undefined}
												/>
											</>
										) : (
											<div className="alert alert-danger">
												Comments are closed
											</div>
										)}
									</div>
								</section>
							</article>
						</Globalcontent>
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default PostRead;
