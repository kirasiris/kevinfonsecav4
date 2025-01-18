import { Suspense } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/blog/loading";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import LiveCode from "@/components/admin/snippets/livecode";

async function getSnippet(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const SnippetRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

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
		</>
	);
};

export default SnippetRead;
