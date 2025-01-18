import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDateWithoutTime } from "befree-utilities";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";

async function getVideo(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function updateViews(params) {
	const res = await fetchurl(`/videos${params}/addview`, "PUT", "no-cache");
	return res;
}

const VideoRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getUserOnServer();

	const getVideosData = getVideo(`/${awtdParams.id}`);
	await updateViews(`/${awtdParams.id}`);

	const [video] = await Promise.all([getVideosData]);

	return (
		<Suspense fallback={<Loading />}>
			<div className="bg-secondary border-0 rounded-0 p-0 mb-3">
				<div className="container">
					<video
						id="player"
						playsInline
						controls
						data-poster="/path/to/poster.jpg"
						style={{ marginBottom: "-8px", maxWidth: "100%" }}
					>
						<source
							src={video?.data?.files?.video_url?.location?.secure_location}
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
			</div>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="card mb-3">
							<div className="card-body">
								<div className="clearfix">
									<button
										type="button"
										className="btn btn-light btn-sm float-start mb-1 me-1"
									>
										{video.data.title}
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
									<button type="button" className="btn btn-light btn-sm mb-1">
										Views {video.data.views}
									</button>
								</div>
								<hr />
								<ParseHtml text={video.data.text} />
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
									<a className="btn btn-dark btn-sm me-1">Category</a>
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
													page: undefined,
													limit: undefined,
												},
											}}
											passHref
											legacyBehavior
										>
											<a className="btn btn-dark btn-sm me-1">
												{video.data.language}
											</a>
										</Link>
										<ReportModal postId={1} postType="video" onModel="Video" />
									</div>
									<div className="float-end">
										<button className="btn btn-light btn-sm me-1">Date</button>
										<button className="btn btn-dark btn-sm">
											{formatDateWithoutTime(video.data.createdAt)}
										</button>
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
						{/* HERE GOES THE COMMENTS */}
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
