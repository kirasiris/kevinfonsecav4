import { fetchurl } from "@/helpers/setTokenOnServer";
import Jumbotron from "@/components/course/jumbotron";
import List from "@/components/course/profileslist";

async function getCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

async function getCourseStudentsEnrolled(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/subscribers${params}`
	);
	return res.json();
}

const CourseProfileIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseStudentsEnrolledData = getCourseStudentsEnrolled(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&onModel=Course${decrypt}`
	);

	const [course, enrolledstudents] = await Promise.all([
		getCoursesData,
		getCourseStudentsEnrolledData,
	]);

	const myParams = {
		category: course?.data?.category,
		subcategory: course?.data?.sub_category,
	};

	return (
		<>
			<Jumbotron
				object={course}
				params={myParams}
				imageWidth="440"
				imageHeight="570"
			/>
			<List objects={enrolledstudents} searchParams={searchParams} />
		</>
	);
};

export default CourseProfileIndex;
