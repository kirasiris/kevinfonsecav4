import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import LiveCode from "@/components/noadmin/snippets/livecode";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getSnippet(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const SnippetRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	const auth = await getUserOnServer();

	const getSnippetsData = getSnippet(`/${awtdParams.id}`);

	const [snippet] = await Promise.all([getSnippetsData]);

	return (
		<>
			<style>
				{`	.code-previewer {
						height: 0%;
					}`}
			</style>
			<Head
				title={`${settings?.data?.title} - ${snippet.data.title}`}
				description={snippet.data.excerpt || snippet.data.text}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/snippet/${snippet.data._id}/${snippet.data.slug}`}
				author={snippet.data.user.name}
				createdAt={snippet.data.createdAt}
				updatedAt={snippet.data.updatedAt}
				locales=""
				posType="snippet"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header title={snippet.data.title} />
					<div className="container">
						{snippet.data.status === "published" ||
						awtdSearchParams.isAdmin === "true" ? (
							<div className="row">
								<Globalcontent containerClasses={`col-lg-12`}>
									<LiveCode
										object={snippet?.data}
										title={snippet?.data?.title}
										MyHtml={snippet?.data?.code?.html}
										MyCss={snippet?.data?.code?.css}
										MyJs={snippet?.data?.code?.javascript}
										hasId={true}
										positionFixed={false}
										isFull={false}
									/>
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

export default SnippetRead;
