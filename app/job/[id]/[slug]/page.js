import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import Header from "@/layout/header";
import Sidebar from "@/layout/job/sidebar";
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
import Map from "@/components/global/map";
import CommentBox from "@/components/global/commentbox";
import CommentForm from "@/components/global/commentform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getJob(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

const JobRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 15;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getJobsData = getJob(`/${awtdParams.id}`);

	const getCommentsData = getComments(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`
	);

	const [job, comments] = await Promise.all([getJobsData, getCommentsData]);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/job/${job?.data?._id}/${job?.data?.category?._id}/${job?.data?.category?.slug}/${job?.data?.slug}`
		);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={job.data.title}
				description={job.data.excerpt || job.data.text}
				// favicon=""
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/job/${job.data._id}/${job.data.slug}`}
				author={job.data.user.name}
				createdAt={job.data.createdAt}
				updatedAt={job.data.updatedAt}
				locales=""
				posType="job"
			/>
			<Header title={job.data.title} />
			<div className="container">
				{job.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader object={job} url={`/job/${job?.data?.slug}`} />
								{/* <figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											job?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${job?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure> */}
								<section className="mb-5">
									<ParseHtml text={job?.data?.text} />
									<Map object={job?.data} />
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										<ExportModal
											linkToShare={`/job/${job?.data?._id}/${job?.data?.slug}`}
											object={job?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={job?.data?._id}
											postType="job"
											onModel="Job"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={job?.data?.user} />
									{job?.data?.commented ? (
										<>
											<CommentForm
												auth={auth}
												resourceId={job?.data?._id}
												parentId={undefined}
												returtopageurl={`/job/${job?.data?._id}/${job?.data?.slug}`}
												onModel="Job"
												objects={comments}
											/>
											<CommentBox
												auth={auth}
												allLink={`/comment?resourceId=${job?.data?._id}&page=1&limit=10&sort=-createdAt&status=published`}
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

export default JobRead;
