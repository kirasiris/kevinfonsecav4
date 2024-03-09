import { fetchurl } from "@/helpers/setTokenOnServer";
import Jumbotron from "@/components/course/jumbotron";
// import List from "@/components/course/commentslist";

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

async function getCourseComments(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/comments${params}`);
	return res.json();
}

const CourseCommentsIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCoursesData = getCourse(`/${params.id}`);

	const getCourseCommentsData = getCourseComments(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&onModel=Course${decrypt}`
	);

	const verifyUserEnrollment = getCourseStudents(
		`?user=${
			auth?.data ? auth.data?._id : `62ec7926a554425c9e03782d`
		}&resourceId=${params.id}&onModel=Course`
	);

	const [course, comments, verifyAuthEnrollment] = await Promise.all([
		getCoursesData,
		getCourseCommentsData,
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
			<div className="container">
				<div className="row">
					<div className="col-lg-12">HERE ARE SUPPOSED TO BE THE COMMENTS</div>
				</div>
			</div>
			{/* <List objects={comments} searchParams={searchParams} /> */}
		</>
	);
};

export default CourseCommentsIndex;
