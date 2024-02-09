import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/blog/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
// import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getCourseLessons(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/videos${params}&sort=-orderingNumber`
	);

	return res.json();
}

const CourseRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&onModel=Course`
	);

	const [course, lessons] = await Promise.all([
		getCoursesData,
		getCourseLessonsData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={course.data.title} description={course.data.sub_title} />
			<div className="container">
				{course.data.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<div className="col-lg-8">
							<div className="card mb-3">
								<div className="card-header">{course.data.title}</div>
								<div className="card-body">
									<ParseHtml text={course.data.text} />
								</div>
							</div>
							<div className="card">
								<div className="card-header">Episodes</div>
								{lessons?.data?.length > 0 ? (
									<ul
										className="list-group list-group-flush overflow-x-hidden"
										style={{ maxHeight: "1000px" }}
									>
										{lessons.data.map((lesson, index) => (
											<li key={lesson._id} className="list-group-item">
												<Link
													href={`/video/${lesson._id}/${lesson.slug}`}
													passHref
													legacyBehavior
												>
													<a>
														{index} - {lesson.title}
													</a>
												</Link>
											</li>
										))}
									</ul>
								) : (
									<div className="alert alert-danger rounded-0  m-0 border-0">
										Nothing found
									</div>
								)}
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
							<figure className="mb-3 bg-dark">
								<Image
									className="img-fluid p-3"
									src={
										course?.data?.files?.avatar?.location?.secure_location ||
										`https://source.unsplash.com/random/260x370`
									}
									alt={`${course?.data?.files?.avatar?.location?.filename}'s featured image`}
									width={440}
									height={570}
									priority
								/>
							</figure>
						</div>
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default CourseRead;
