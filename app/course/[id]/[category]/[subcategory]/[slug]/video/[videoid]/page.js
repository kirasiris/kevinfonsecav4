import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { formatDateWithoutTime } from "@/helpers/utilities";
import Menu from "@/components/course/menu";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getCourse(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
}

async function getCourseLessons(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

async function getCourseStudents(params) {
	const res = await fetchurl(`/subscribers${params}`, "GET", "no-cache");
	return res;
}

async function getVideo(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

async function updateViews(params) {
	const res = await fetchurl(`/videos${params}/addview`, "PUT", "no-cache");
	return res;
}

const VideoRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(
			`/auth/login?returnpage=/course/${params.id}/${params.category}/${params.subcategory}/${params.slug}/video/${params.videoid}`
		);

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&sort=orderingNumber&onModel=Course`
	);
	// Verify if user is enrolled (it means if course is not free, user should have paid and/or enrolled already)
	const verifyUserEnrollment = getCourseStudents(
		`?user=${
			auth?.data ? auth.data?._id : `62ec7926a554425c9e03782d`
		}&resourceId=${params.id}&onModel=Course`
	);

	const getVideosData = getVideo(`/${params.videoid}`);
	await updateViews(`/${params.videoid}`);

	const [course, lessons, verifyAuthEnrollment, video] = await Promise.all([
		getCoursesData,
		getCourseLessonsData,
		verifyUserEnrollment,
		getVideosData,
	]);

	// If course is free or not free and otherwise enrolled, let user access to video.
	// If not, then redirect user to course overview page
	(course?.data?.isFree ||
		(!course?.data?.isFree && !verifyAuthEnrollment?.success)) &&
		redirect(
			`/course/${course?.data._id}/${course?.data?.category}/${course?.data?.sub_category}/${course?.data?.slug}/index`
		);

	return (
		<Suspense fallback={<Loading />}>
			<div className="bg-secondary border-0 rounded-0 p-0">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-9 p-0">
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
						<div className="col-lg-3 p-0">
							{lessons?.data?.length > 0 ? (
								<ul
									className="list-group list-group-flush overflow-x-hidden"
									style={{ maxHeight: "1073px" }}
								>
									{lessons.data.map((lesson, index) => (
										<li
											key={lesson._id}
											className={`${index} list-group-item ${lesson.orderingNumber}`}
										>
											<div className="float-start">
												<Link
													href={`/course/${course.data._id}/${course.data.category}/${course.data.sub_category}/${course.data.slug}/video/${lesson._id}`}
													passHref
													legacyBehavior
												>
													<a>
														<span className="badge bg-secondary me-1">
															{lesson.orderingNumber}
														</span>
														{lesson.title}
													</a>
												</Link>
											</div>
										</li>
									))}
								</ul>
							) : (
								<div className="alert alert-danger rounded-0  m-0 border-0">
									Nothing&nbsp;found
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Menu object={course} />
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