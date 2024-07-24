import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/layout/header";
import Sidebar from "@/layout/forum/sidebar";
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
import Head from "@/app/head";

async function getForum(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

async function updateViews(params) {
	const res = await fetchurl(`/forums${params}/addview`, "PUT", "no-cache");
	return res;
}

const ForumRead = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 15;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getForumsData = getForum(`/${params.id}`);

	const getCommentsData = getComments(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`
	);

	await updateViews(`/${params.id}`);

	const [forum, comments] = await Promise.all([getForumsData, getCommentsData]);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/forum/${forum?.data?._id}/${forum?.data?.category?._id}/${forum?.data?.category?.slug}/${forum?.data?.slug}`
		);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={forum.data.title}
				description={forum.data.text}
				// favicon=""
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category={forum.data.category.title}
				url={`/forum/${forum.data._id}/${forum.data.category}/${forum.data.sub_category}/${forum.data.slug}`}
				author={forum.data.user.name}
				createdAt={forum.data.createdAt}
				updatedAt={forum.data.updatedAt}
				locales=""
				posType="forum"
			/>
			<Header title={forum.data.title} />
			<div className="container">
				{forum.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader
									object={forum}
									url={`/forum/category/${forum?.data?.category}/${forum?.data?.sub_category}`}
								/>
								<section className="mb-5">
									<ParseHtml text={forum?.data?.text} />
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										<ExportModal
											linkToShare={`/forum/${forum?.data?._id}/${forum?.data?.category}/${forum?.data?.sub_category}/${forum?.data?.slug}`}
											object={forum?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={forum?.data?._id}
											postType="forum"
											onModel="Forum"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={forum?.data?.user} />
									<div className="comments">
										<DisqusComments
											auth={auth}
											object={forum}
											returtopageurl={`/forum/${forum?.data?._id}/${forum?.data?.category?._id}/${forum?.data?.category?.slug}/${forum?.data?.slug}`}
										/>
										{forum?.data?.commented ? (
											<>
												{auth?.userId ? (
													<MyFinalCommentForm
														resourceId={forum?.data?._id}
														parentId={undefined}
														returtopageurl={`/forum/${forum?.data?._id}/${forum?.data?.category?._id}/${forum?.data?.category?.slug}/${forum?.data?.slug}`}
														postType="forum"
														onModel="Forum"
													/>
												) : (
													<div className="alert alert-info">
														<Link
															href={{
																pathname: `/auth/login`,
																query: {
																	returnpage: `/forum/${forum?.data?._id}/${forum?.data?.category?._id}/${forum?.data?.category.slug}/${forum?.data?.slug}`,
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
													allLink={`/comment?resourceId=${forum?.data?._id}&page=1&limit=15&sort=-createdAt&status=published`}
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
						<Sidebar />
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default ForumRead;
