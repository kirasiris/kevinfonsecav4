import { Suspense } from "react";
import { notFound } from "next/navigation";
import Loading from "@/app/blog/loading";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";
import Jumbotron from "@/components/course/jumbotron";

async function getCourse(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
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

const CourseLessonsIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 1000;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getCoursesData = getCourse(`/${params.id}`);

	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&sort=orderingNumber&onModel=Course`
	);

	const getCourseStudentsData = getCourseStudents(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=${sort}&onModel=Course${decrypt}`
	);

	const verifyUserEnrollment = getCourseStudents(
		`?user=${auth ? auth.userId : `62ec7926a554425c9e03782d`}&resourceId=${
			params.id
		}&onModel=Course`
	);

	const [course, lessons, enrolledstudents, verifyAuthEnrollment] =
		await Promise.all([
			getCoursesData,
			getCourseLessonsData,
			getCourseStudentsData,
			verifyUserEnrollment,
		]);

	return (
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
				searchParams={searchParams}
				isIndex={true}
				linkToShare={`/course/${course?.data?._id}/${course?.data?.category}/${course?.data?.sub_category}/${course?.data?.slug}/index`}
				postType="course"
				onModel="Course"
			/>
		</Suspense>
	);
};

export default CourseLessonsIndex;
