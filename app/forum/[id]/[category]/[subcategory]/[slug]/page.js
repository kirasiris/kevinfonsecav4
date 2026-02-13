import { Suspense } from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Header from "@/layout/header";
import Sidebar from "@/layout/forum/sidebar";
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
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

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
		<Suspense fallback={<Loading />}>
			<Head
				title={forum.data.title}
				description={forum.data.excerpt || forum.data.text}
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
										<>
											<CommentForm
												auth={auth}
												resourceId={forum?.data?._id}
												parentId={undefined}
												returtopageurl={`/forum/${forum?.data?._id}/${forum?.data?.category}/${forum?.data?.sub_category}/${forum?.data?.slug}`}
												onModel="Forum"
												objects={comments}
											/>
											<CommentBox
												auth={auth}
												allLink={`/comment?resourceId=${forum?.data?._id}&page=1&limit=10&sort=-createdAt&status=published`}
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
