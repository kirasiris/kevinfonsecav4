import { Suspense } from "react";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";
import Jumbotron from "@/components/course/jumbotron";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

async function getCourseLessons(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/videos${params}`);
	return res.json();
}

async function getCourseStudentsEnrolled(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/subscribers${params}`
	);
	return res.json();
}

const CourseLessonsIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&sort=orderingNumber&onModel=Course`
	);
	const getCourseStudentsEnrolledData = getCourseStudentsEnrolled(
		`?resourceId=${params.id}&onModel=Course`
	);
	const verifyUserEnrollment = getCourseStudentsEnrolled(
		`?user=${
			auth?.data ? auth.data._id : `62ec7926a554425c9e03782d`
		}&resourceId=${params.id}&onModel=Course`
	);

	const [course, lessons, enrolledstudents, verifyAuthEnrollment] =
		await Promise.all([
			getCoursesData,
			getCourseLessonsData,
			getCourseStudentsEnrolledData,
			verifyUserEnrollment,
		]);

	return (
		<Suspense fallback={<Loading />}>
			<Jumbotron
				authenticatedUser={auth}
				object={course}
				params={params}
				enrollmentVerification={verifyAuthEnrollment}
				imageWidth="440"
				imageHeight="570"
			/>
			<List
				authenticatedUser={auth}
				enrollmentVerification={verifyAuthEnrollment}
				object={course}
				objects={lessons}
				students={enrolledstudents}
				isAdmin={false}
				searchParams={searchParams}
				isIndex={true}
				linkToShare={`localhost:3000/course/${course?.data?._id}/${params.category}/${params.subcategory}/${course?.data?.slug}/index`}
				postType="course"
				onModel="Course"
			/>
		</Suspense>
	);
};

export default CourseLessonsIndex;
