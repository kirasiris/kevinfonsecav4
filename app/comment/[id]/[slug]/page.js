import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/blog/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
async function getComment(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}
const CommentRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const auth = await getUserOnServer();
	const getCommentsData = getComment(`/${awtdParams.id}`);
	const [comment] = await Promise.all([getCommentsData]);
	console.log(comment);
	// return (
	// 	<Suspense fallback={<Loading />}>
	//      <Head />
	// 		<Header title={comment.data.title} />
	// 		<div className="container">
	// 			{comment.data.status === "published" ||
	// 			searchParams.isAdmin === "true" ? (
	// 				<div className="row">
	// 					<Globalcontent containerClasses={`col-lg-12`}>
	// 						<article className={`${comment.data._id}`}>
	// 							<div
	// 								className="d-flex my-4"
	// 								id={`media comment-${comment.data._id}`}
	// 							>
	// 								<div className="flex-shrink-0">
	// 									<Link
	// 										href={`/profile/${comment.data.user._id}/${comment.data.user.username}`}
	// 										passHref
	// 										legacyBehavior
	// 									>
	// 										<Image
	// 											src={
	// 												comment.data.user.files?.avatar?.location
	// 													.secure_location ||
	// 												`https://source.unsplash.com/random/64x64`
	// 											}
	// 											alt={`${comment.data.user.username}'s featured image`}
	// 											width={64}
	// 											height={64}
	// 											className="div-hover"
	// 										/>
	// 									</Link>
	// 								</div>
	// 								<div className="flex-grow-1 ms-3">
	// 									<section className="mb-5">
	// 										<Link
	// 											href={`/comment/${comment.data._id}/${comment.data.slug}`}
	// 											passHref
	// 											legacyBehavior
	// 										>
	// 											{comment.data.title}
	// 										</Link>
	// 										&nbsp;by&nbsp;{comment.data.user.username}
	// 										<hr />
	// 										<pre>{JSON.stringify(comment.data, null, 4)}</pre>
	// 										{comment.data.onModel === "Blog" && (
	// 											<Link
	// 												href={`/blog/${comment.data.resourceId._id}/${comment.data.resourceId.category._id}/${comment.data.resourceId.category.slug}/${comment.data.resourceId.slug}`}
	// 												passHref
	// 												legacyBehavior
	// 											>
	// 												<a className="btn btn-secondary btn-sm">
	// 													Return to original post?
	// 												</a>
	// 											</Link>
	// 										)}
	// 										{comment.data.onModel === "Course" && (
	// 											<Link
	// 												href={`/course/${comment.data.resourceId._id}/${comment.data.resourceId.category}/${comment.data.resourceId.sub_category}/${comment.data.resourceId.slug}/index`}
	// 												passHref
	// 												legacyBehavior
	// 											>
	// 												<a className="btn btn-secondary btn-sm">
	// 													Return to original post?
	// 												</a>
	// 											</Link>
	// 										)}
	// 										{comment.data.onModel === "Comment" && (
	// 											<Link
	// 												href={`/comment/${comment.data.resourceId._id}/${comment.data.resourceId.slug}`}
	// 												passHref
	// 												legacyBehavior
	// 											>
	// 												<a className="btn btn-secondary btn-sm">
	// 													Return to original post?
	// 												</a>
	// 											</Link>
	// 										)}
	// 										<hr />
	// 										<ParseHtml text={comment.data.text} />
	// 										<hr />
	// 										<div className="float-start">
	// 											<ExportModal
	// 												linkToShare={`localhost:300/comment/${comment.data._id}/${comment.data.slug}`}
	// 												object={comment?.data}
	// 											/>
	// 										</div>
	// 										<div className="float-end">
	// 											<ReportModal
	// 												postId={comment?.data?._id}
	// 												postType="comment"
	// 												onModel="Comment"
	// 											/>
	// 										</div>
	// 										<div style={{ clear: "both" }} />
	// 										<AuthorBox author={comment?.data?.user} />
	// 										<CommentBox
	// 											auth={auth.data}
	// 											authorization={auth.authorizationTokens}
	// 											user={comment?.data?.user}
	// 											postId={comment?.data?._id}
	// 											secondPostId={comment?.data?._id}
	// 											parentId={comment?.data?._id}
	// 											isVisible={true}
	// 											onModel="Comment"
	// 										/>
	// 									</section>
	// 								</div>
	// 							</div>
	// 						</article>
	// 					</Globalcontent>
	// 				</div>
	// 			) : (
	// 				<p>Not visible</p>
	// 			)}
	// 		</div>
	// 	</Suspense>
	// );
};
export default CommentRead;
