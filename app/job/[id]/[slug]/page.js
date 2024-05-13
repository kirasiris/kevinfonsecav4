import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/job/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import Map from "@/components/global/map";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getJob(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	return res;
}

const JobRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getJobsData = getJob(`/${params.id}`);

	const [job] = await Promise.all([getJobsData]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={job.data.title} />
			<div className="container">
				{job.data.status === "published" || searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses={`col-lg-8`}>
							<article>
								<ArticleHeader object={job} url={`/job/${job?.data?.slug}`} />
								{/* <figure className="mb-4">
									<Image
										className="img-fluid"
										src={
											job?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										alt={`${job?.data?.files?.avatar?.location?.filename}'s featured image`}
										width={1200}
										height={900}
										priority
									/>
								</figure> */}
								<section className="mb-5">
									<ParseHtml text={job?.data?.text} />
									<hr />
									<Map object={job?.data} />
									<hr />
									<div className="float-start">
										{job?.data?.category && (
											<ExportModal
												linkToShare={`localhost:3000/job/${job?.data?._id}/${job?.data?.slug}`}
												object={job?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											postId={job?.data?._id}
											postType="job"
											onModel="Job"
										/>
									</div>
									<div style={{ clear: "both" }} />
									{/* <AuthorBox author={job?.data?.user} /> */}
									{/*<CommentBox
										auth={auth.data}
										authorization={auth.authorizationTokens}
										user={job?.data?.user}
										postId={job?.data?._id}
										secondPostId={job?.data?._id}
										isVisible={job?.data?.commented}
										onModel="Job"
									/> */}
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

export default JobRead;
