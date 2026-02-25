import { Suspense } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/course/loading";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";
import Jumbotron from "@/components/course/jumbotron";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getCourse(params) {
	const res = await fetchurl(
		`/extras/stripe/courses${params}`,
		"GET",
		"no-cache",
	);
	if (!res.success) notFound();
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

const CourseRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { auth, settings } = await getGlobalData();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCoursesData = getCourse(`/${awtdParams.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${awtdParams.id}&sort=orderingNumber&onModel=Course`,
	);

	const getCourseStudentsData = getCourseStudents(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&onModel=Course${decrypt}`,
	);

	const verifyUserEnrollment = getCourseStudents(
		`?user=${
			auth?.data ? auth.data?._id : process.env.NEXT_PUBLIC_ADMIN_ACCOUNT_ID
		}&resourceId=${awtdParams.id}&onModel=Course`,
	);

	const [course, lessons, enrolledstudents, verifyAuthEnrollment] =
		await Promise.all([
			getCoursesData,
			getCourseLessonsData,
			getCourseStudentsData,
			verifyUserEnrollment,
		]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${course.data.title}`}
				description={course.data.excerpt || course.data.text}
				favicon={settings?.data?.favicon}
				postImage={course.data.files.avatar.location.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category={course.data.category.title}
				url={`course/${course.data._id}/${course.data.category._id}/${course.data.category.slug}/${course.data.slug}`}
				author={course.data.user.name}
				createdAt={course.data.createdAt}
				updatedAt={course.data.updatedAt}
				locales=""
				posType="blog"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Jumbotron
						auth={auth}
						object={course}
						enrollmentVerification={verifyAuthEnrollment}
						imageWidth="440"
						imageHeight="570"
					/>
					<List
						auth={auth}
						enrollmentVerification={verifyAuthEnrollment}
						object={course}
						objects={lessons}
						students={enrolledstudents}
						isAdmin={false}
						searchParams={awtdSearchParams}
						isIndex={true}
						linkToShare={`/course/${course?.data?._id}`}
						postType="course"
						onModel="Course"
					/>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default CourseRead;
