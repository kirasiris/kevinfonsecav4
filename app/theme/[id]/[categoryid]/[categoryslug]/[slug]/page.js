import { Suspense } from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import showdown from "showdown";
import base64 from "base-64";
import Header from "@/layout/header";
import Sidebar from "@/layout/theme/sidebar";
import Loading from "@/app/theme/loading";
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
import { getGlobalData } from "@/helpers/globalData";

async function getTheme(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	return res;
}

async function getReadMe(repoName) {
	const response = await fetch(
		`https://api.github.com/repos/kirasiris/${repoName}/contents/README.md`,
		{
			method: "GET",
			accept: "application/vnd.github+json",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
			},
			cache: "no-store",
		},
	)
		.then(async (res) => {
			if (!res.ok) {
				// check if there was JSON
				const contentType = res.headers.get("Content-Type");
				if (contentType && contentType.includes("application/json")) {
					// return a rejected Promise that includes the JSON
					return res.json().then((json) => Promise.reject(json));
				}
				// no JSON, just throw an error
				throw new Error("Something went horribly wrong 💩");
			}
			return res.json();
		})
		.then((data) => data)
		.catch((err) => {
			console.log(err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from setTokenOnServer file", err);
			}
		});

	return response;
}

const ThemeRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 15;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const auth = await getUserOnServer();

	const getThemesData = getTheme(`/${awtdParams.id}`);

	const getCommentsData = getComments(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`,
	);

	const [theme, comments] = await Promise.all([getThemesData, getCommentsData]);

	const readMeResponse = await getReadMe(theme.data.github_readme);

	const readMEDecoder = (text) => {
		const converter = new showdown.Converter();
		const readMEContentBase64 = base64.decode(text);
		const textConverted = converter.makeHtml(readMEContentBase64);
		return textConverted;
	};

	const readme = readMEDecoder(
		readMeResponse.content || "Tm8gcmVhZE1FIGZpbGU=",
	);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/comments/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/theme/${theme?.data?._id}/${theme?.data?.category?._id}/${theme?.data?.category?.slug}/${theme?.data?.slug}`,
		);
	};

	// Handle Trash All

	// Handle Delete All

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - ${theme.data.title}`}
				description={theme.data.excerpt || theme.data.text}
				favicon={settings?.data?.favicon}
				postImage={theme.data.files.avatar.location.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category={theme.data.category.title}
				url={`/theme/${theme.data._id}/${theme.data.category._id}/${theme.data.category.slug}/${theme.data.slug}`}
				author={theme.data.user.name}
				createdAt={theme.data.createdAt}
				updatedAt={theme.data.updatedAt}
				locales=""
				posType="theme"
			/>
			<Header title={theme.data.title} />
			<div className="container-fluid">
				{theme.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader
									object={theme}
									url={`/theme/category/${theme.data.category._id}/${theme.data.category.slug}`}
								/>
								{/* HERE GOES THE FIGURE */}
								<section className="mb-5">
									<ParseHtml text={theme.data.text} />
									<div className="card mb-4">
										<div className="card-header">ReadMe.md</div>
										<div className="card-body">
											<ParseHtml text={readme} />
										</div>
									</div>
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										{theme?.data?.category && (
											<ExportModal
												linkToShare={`/theme/${theme?.data?._id}/${theme?.data?.category?._id}/${theme?.data?.category.slug}/${theme?.data?.slug}`}
												object={theme?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={theme?.data?._id}
											postType="theme"
											onModel="Blog"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={theme?.data?.user} />
									{theme?.data?.commented ? (
										<>
											<CommentForm
												auth={auth}
												resourceId={theme?.data?._id}
												parentId={undefined}
												returtopageurl={`/theme/${theme?.data?._id}/${theme?.data?.category?._id}/${theme?.data?.category.slug}/${theme?.data?.slug}`}
												onModel="Blog"
												objects={comments}
											/>
											<CommentBox
												auth={auth}
												allLink={`/comment?resourceId=${theme?.data?._id}&page=1&limit=10&sort=-createdAt&status=published`}
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
						<Sidebar object={theme} />
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default ThemeRead;
