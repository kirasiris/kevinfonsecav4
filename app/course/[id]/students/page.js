import { fetchurl } from "@/helpers/setTokenOnServer";
import Jumbotron from "@/components/course/jumbotron";
import List from "@/components/course/profileslist";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

async function getCourseStudents(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/subscribers${params}`
	);
	return res.json();
}

const CourseStudentsIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCoursesData = getCourse(`/${params.id}`);

	const getCourseStudentsData = getCourseStudents(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&onModel=Course${decrypt}`
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
