import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/layout/header";
import Loading from "@/app/pages/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

async function getPage(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const PageRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	const getPagesData = getPage(`/${awtdParams.id}`);

	const [page] = await Promise.all([getPagesData]);

	// Draft It

	// Publish It

	// Trash It

	// Schedule It

	// Handle Trash All

	// Handle Delete All

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${page.data.title}`}
				description={page.data.excerpt || page.data.text}
				favicon={settings?.data?.favicon}
				postImage={settings?.data?.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/page/${page.data._id}/${page.data.slug}`}
				author={page.data.user.name}
				createdAt={page.data.createdAt}
				updatedAt={page.data.updatedAt}
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header title={page.data.title} />
					<div className="container">
						{page.data.status === "published" ||
						awtdSearchParams.isAdmin === "true" ? (
							<div className="row">
								<Globalcontent containerClasses={`col-lg-12`}>
									<article>
										<ArticleHeader
											object={page}
											url={`/page/category/${page?.data?.category?._id}/${page?.data?.category?.slug}`}
										/>
										{/* <figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											page?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${page?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure> */}
										<section className="mb-5">
											<ParseHtml text={page?.data?.text} />
											<NewsletterForm
												sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
												headingClassList=""
											/>
											<div className="float-start">
												<ExportModal
													linkToShare={`/page/${page?.data?._id}/${page?.data?.slug}`}
													object={page?.data}
												/>
											</div>
											<div className="float-end">
												<ReportModal
													resourceId={page?.data?._id}
													postType="page"
													onModel="Page"
												/>
											</div>
											<div style={{ clear: "both" }} />
											<AuthorBox author={page?.data?.user} />
										</section>
									</article>
								</Globalcontent>
							</div>
						) : (
							<p>Not visible</p>
						)}
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default PageRead;
