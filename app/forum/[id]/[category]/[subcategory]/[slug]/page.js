import { Suspense } from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Header from "@/layout/header";
import Sidebar from "@/layout/forum/sidebar";
import Loading from "@/app/forum/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import Head from "@/app/head";
import CommentBox from "@/components/global/commentbox";
import { getGlobalData } from "@/helpers/globalData";

async function getForum(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	return res;
}

async function updateViews(params) {
	const res = await fetchurl(
		`/global/forums${params}/addview`,
		"PUT",
		"no-cache",
	);
	return res;
}

const ForumRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 15;
	const sort = awtdSearchParams.sort || "-createdAt";

	const { settings } = await getGlobalData();

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const getForumsData = getForum(`/${awtdParams.id}`);

	const getCommentsData = getComments(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`,
	);

	await updateViews(`/${awtdParams.id}`);

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
			`/forum/${forum?.data?._id}/${forum?.data?.category?._id}/${forum?.data?.category?.slug}/${forum?.data?.slug}`,
		);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${forum.data.title}`}
				description={forum.data.excerpt || forum.data.text}
				favicon={settings?.data?.favicon?.location?.secure_location}
				postImage={settings.data.showcase_image?.location?.secure_location}
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
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header title={forum.data.title} />
					<section className="py-5">
						<div className="container">
							{forum.data.status === "published" ||
							awtdSearchParams.isAdmin === "true" ? (
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
												{forum?.data?.commented ? (
													<CommentBox
														resourceId={forum?.data?._id}
														onModel="Forum"
														postType="comment"
														advancedTextEditor={false}
														token={token}
														auth={auth}
														endpoint="/global/comments"
														createEndpoint={`/global/comments/${forum?.data?._id}`}
														isRemote={false}
														comments={comments}
														onCreate={null}
														onPosted={null}
														searchParams={awtdSearchParams}
														heading="Comments"
														emptyText="No comments yet."
														pageSize={25}
														siblings={1}
														displayPagination={true}
														displayComposer={true}
														newestFirst={true}
														profileBasePath={`/profile`}
														decodeStoredEntities={true}
														className=""
													/>
												) : (
													<div className="alert alert-danger">
														Comments are closed
													</div>
												)}
											</section>
										</article>
									</Globalcontent>
									<Sidebar />
								</div>
							) : (
								<p>Not visible</p>
							)}
						</div>
					</section>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ForumRead;
