import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/snippet/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import LiveCode from "@/components/admin/snippets/livecode";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getSnippet(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getSnippetsData = getSnippet(`/${params.id}`);

	const [snippet] = await Promise.all([getSnippetsData]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={snippet.data.title} />
			<div className="container">
				{snippet.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-12`}>
							<article>WORK IN PROGRESS</article>
						</Globalcontent>
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default SnippetRead;