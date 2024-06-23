import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/layout/header";
import Sidebar from "@/layout/forum/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getForum(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function updateViews(params) {
	const res = await fetchurl(`/forums${params}/addview`, "PUT", "no-cache");
	return res;
}

const ForumRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getForumsData = getForum(`/${params.id}`);
	await updateViews(`/${params.id}`);

	const [forum] = await Promise.all([getForumsData]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={forum.data.title} />
			<div className="container">
				{forum.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader
									object={forum}
									url={`/forum/category/${forum?.data?.category}/${forum?.data?.sub_category}`}
								/>
								<section className="mb-5">
									<ParseHtml text={forum?.data?.text} />
									<hr />
									<div className="float-start">
										<ExportModal
											linkToShare={`localhost:3000/forum/${forum?.data?._id}/${forum?.data?.category}/${forum?.data?.sub_category}/${forum?.data?.slug}`}
											object={forum?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											postId={forum?.data?._id}
											postType="forum"
											onModel="Forum"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={forum?.data?.user} />
									<CommentBox
										auth={auth?.data}
										authorization={auth?.authorizationTokens}
										user={forum?.data?.user}
										postId={forum?.data?._id}
										secondPostId={forum?.data?._id}
										isVisible={forum?.data?.commented}
										onModel="Forum"
									/>
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
