import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/layout/header";
import Loading from "@/app/changelog/loading";
import ParseHtml from "@/layout/parseHtml";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AuthorBox from "@/components/global/authorbox";
import NewsletterForm from "@/components/global/newsletter";
import ExportModal from "@/components/global/exportmodal";
import ReportModal from "@/components/global/reportmodal";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getChangelog(params) {
	const res = await fetchurl(`/global/changelogs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ChangelogRead = async ({ params }) => {
	const awtdParams = await params;

	const { settings } = await getGlobalData();

	const auth = await getUserOnServer();
	const getChangelogsData = getChangelog(`/${awtdParams.id}`);

	const [changelog] = await Promise.all([getChangelogsData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${changelog.data.title}`}
				description={changelog.data.excerpt || changelog.data.text}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/changelog/${changelog.data._id}/${changelog.data.slug}`}
				author={changelog.data.user.name}
				createdAt={changelog.data.createdAt}
				updatedAt={changelog.data.updatedAt}
				locales=""
				posType="changelog"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header title={changelog?.data?.title} />
					<div className="container">
						<div className="row">
							<div className={`col-lg-12`}>
								<article>
									<header className="mb-4">
										<h1>{changelog?.data?.title}</h1>
										<div className="text-muted fst-italic mb-2">
											Posted on {changelog?.data?.createdAt} by{" "}
											{changelog?.data?.user?.username}
										</div>
									</header>
									<section className="mb-5">
										<ParseHtml text={changelog?.data?.text} />
										<NewsletterForm
											sectionClassList="text-bg-dark text-center pt-3 pb-3 mt-4 mb-4"
											headingClassList=""
										/>
										<div className="float-start">
											<ExportModal
												linkToShare={`/changelog/${changelog?.data?._id}/${changelog?.data?.slug}`}
												object={changelog?.data}
											/>
										</div>
										<div className="float-end">
											<ReportModal
												resourceId={changelog?.data?._id}
												postType="changelog"
												onModel="Changelog"
											/>
										</div>
										<div style={{ clear: "both" }} />
										<AuthorBox author={changelog?.data?.user} />
									</section>
								</article>
							</div>
						</div>
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ChangelogRead;
