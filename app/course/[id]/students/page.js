import { fetchurl } from "@/helpers/setTokenOnServer";
import { notFound } from "next/navigation";
import Jumbotron from "@/components/course/jumbotron";
import List from "@/components/course/profileslist";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getCourse(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getCourseStudents(params) {
	const res = await fetchurl(`/subscribers${params}`, "GET", "no-cache");
	return res;
}

const CourseStudentsIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getAuthenticatedUser();

	const getCoursesData = getCourse(`/${params.id}`);

	const getCourseStudentsData = getCourseStudents(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=${sort}&onModel=Course${decrypt}`
	);

	const verifyUserEnrollment = getCourseStudents(
		`?user=${
			auth?.data ? auth.data?._id : `62ec7926a554425c9e03782d`
		}&resourceId=${params.id}&onModel=Course`
	);

	const [course, students, verifyAuthEnrollment] = await Promise.all([
		getCoursesData,
		getCourseStudentsData,
		verifyUserEnrollment,
	]);

	return (
		<>
			<Jumbotron
				auth={auth}
				object={course}
				enrollmentVerification={verifyAuthEnrollment}
				imageWidth="440"
				imageHeight="570"
			/>
			<List objects={students} searchParams={searchParams} />
		</>
	);
};

export default CourseStudentsIndex;
