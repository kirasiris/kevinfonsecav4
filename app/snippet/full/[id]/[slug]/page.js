import { Suspense } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/snippet/loading";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import LiveCode from "@/components/noadmin/snippets/livecode";
import ErrorPage from "@/layout/errorpage";
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
				{`
					footer {
						display: none;
					}

					body {
						margin: auto;
					}

					.code-previewer {
						margin-top: 0px;
						height: 100vh;
						margin-bottom: -8px;
					}
				`}
			</style>
			<Head
				title={`${settings?.data?.title} - ${snippet.data.title}`}
				description={snippet.data.excerpt || snippet.data.text}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/snippet/full/${snippet.data._id}/${snippet.data.slug}`}
				author={snippet.data.user.name}
				createdAt={snippet.data.createdAt}
				updatedAt={snippet.data.updatedAt}
				locales=""
				posType="snippet"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					{snippet.data.status === "published" ||
					awtdSearchParams.isAdmin === "true" ? (
						<LiveCode
							object={snippet?.data}
							title={snippet?.data?.title}
							MyHtml={snippet?.data?.code?.html}
							MyCss={snippet?.data?.code?.css}
							MyJs={snippet?.data?.code?.javascript}
							hasId={false}
							positionFixed={false}
							isFull={true}
						/>
					) : (
						<p>Not visible</p>
					)}
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default SnippetRead;
