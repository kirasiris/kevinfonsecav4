import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
// import Plyr from "plyr";
import Header from "@/layout/header";
import Sidebar from "@/layout/video/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";

const VideoRead = async ({ params, searchParams }) => {
	// const player = new Plyr("#player");
	return (
		<Suspense fallback={<Loading />}>
			<div className="bg-secondary border-0 rounded-0 p-0">
				<video
					id="player"
					playsInline
					controls
					data-poster="/path/to/poster.jpg"
					style={{ marginBottom: "-8px" }}
				>
					<source
						src="https://www.youtube.com/watch?v=L59dIq65LSY&list=RDCGLGXkEyE3w&index=17"
						type="video/mp4"
					/>
					{/* TRACK FOR CAPTIONS - OPTIONAL */}
					{/* <track
						kind="captions"
						label="English captions"
						src="/path/to/captions.vtt"
						srclang="en"
						default
					/> */}
				</video>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="card my-1">
							<div className="card-body">
								<div className="clearfix">
									<button
										type="button"
										className="btn btn-light btn-sm float-start mb-1 me-1"
									>
										TITLE
									</button>
									<button
										type="button"
										className="btn btn-danger btn-sm float-end mb-1"
									>
										Subscribe
									</button>

									<button
										type="button"
										className="btn btn-outline-danger btn-sm float-start mb-1 me-1"
									>
										Favorite
									</button>
									<button
										type="button"
										className="btn btn-light btn-sm float-start mb-1 me-1"
									>
										Likes
									</button>
									<button
										type="button"
										className="btn btn-light btn-sm float-start mb-1 me-1"
									>
										Dislikes
									</button>
									<button
										type="button"
										className="btn btn-light btn-sm mb-1 me-1"
									>
										Views
									</button>
								</div>
								<hr />
								<ParseHtml text="Hola" />
								<hr />
								<Link
									href={{
										pathname: `/videos/category/`,
										query: {
											page: 1,
											limit: 10,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-dark btn-sm me-1">CATEGORY</a>
								</Link>
								<hr />
								<div className="clearfix">
									<div className="float-start">
										<button className="btn btn-light btn-sm me-1">
											Language
										</button>
										<Link
											href={{
												pathname: `/videos/search/`,
												query: {
													page: 1,
													limit: 10,
												},
											}}
											passHref
											legacyBehavior
										>
											<a className="btn btn-dark btn-sm me-1">ENGLISH</a>
										</Link>
										<ReportModal postId={1} postType="video" onModel="Video" />
									</div>
									<div className="float-end">
										<button className="btn btn-light btn-sm me-1">Date</button>
										<button className="btn btn-dark btn-sm">Date</button>
									</div>
								</div>
							</div>
						</div>
						<hr />
						<h5>Related Videos</h5>
						<div className="row-cols-*">
							<div className="col">
								<div className="card text-bg-dark">
									{/* <img src="..." class="card-img" alt="..."> */}
									<Image
										className="card-image"
										src={`https://source.unsplash.com/random/500x250`}
										alt={"featured image"}
										width={500}
										height={250}
										priority
									/>
									<div className="card-img-overlay">
										<h5 className="card-title">Card title</h5>
										<p className="card-text">
											This is a wider card with supporting text below as a
											natural lead-in to additional content. This content is a
											little bit longer.
										</p>
										<p className="card-text">
											<small>Last updated 3 mins ago</small>
										</p>
									</div>
								</div>
							</div>
						</div>
						<hr />
						{/* <CommentBox
						user={blog?.data?.user}
						postId={blog?.data?._id}
						secondPostId={blog?.data?._id}
						isVisible={blog?.data?.commented}
						postType="blog"
						onModel="Blog"
					/> */}
					</div>
					<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
						SIDEBAR
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default VideoRead;
