import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/secret/sidebar";
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

async function getSecret(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

const SecretRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 15;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getSecretsData = getSecret(`/${awtdParams.id}`);

	const getCommentsData = getComments(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`
	);

	const [secret, comments] = await Promise.all([
		getSecretsData,
		getCommentsData,
	]);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/secret/${secret?.data?._id}`);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={secret.data.title}
				description={secret.data.text}
				// favicon=""
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/secret/${secret.data._id}`}
				author="Kevin Uriel Fonseca"
				createdAt={secret.data.createdAt}
				updatedAt={secret.data.updatedAt}
				locales=""
				posType="secret"
			/>
			<Header title={secret.data.title} />
			<div className="container mt-4">
				{secret.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent>
							<article>
								<ArticleHeader
									object={secret}
									url={`/secret/category/${secret?.data?.category?._id}/${secret?.data?.category?.slug}`}
								/>
								{/* <figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											secret?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${secret?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure> */}
								<section className="mb-5">
									<ParseHtml text={secret?.data?.text} />
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										<ExportModal
											linkToShare={`/secret/${secret?.data?._id}`}
											object={secret?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={secret?.data?._id}
											postType="secret"
											onModel="Secret"
										/>
									</div>
									<div style={{ clear: "both" }} />
									{/* <AuthorBox author={secret?.data?.user} /> */}
									<div className="d-flex my-4" />
									{secret?.data?.commented ? (
										<>
											<CommentForm
												auth={auth}
												resourceId={secret?.data?._id}
												parentId={undefined}
												returtopageurl={`/secret/${secret?.data?._id}`}
												onModel="Secret"
												objects={comments}
											/>
											<CommentBox
												auth={auth}
												allLink={`/comment?resourceId=${secret?.data?._id}&page=1&limit=10&sort=-createdAt&status=published`}
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

export default SecretRead;
