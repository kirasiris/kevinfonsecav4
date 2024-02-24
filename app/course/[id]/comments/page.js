import { fetchurl } from "@/helpers/setTokenOnServer";
import Jumbotron from "@/components/course/jumbotron";
import List from "@/components/course/profileslist";

async function getCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

async function getCourseComments(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/subscribers${params}`
	);
	return res.json();
}

const CourseCommentsIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseCommentsData = getCourseComments(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&onModel=Course${decrypt}`
	);

	const [course, enrolledstudents] = await Promise.all([
		getCoursesData,
		getCourseCommentsData,
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
			<div className="container">
				<div className="row">
					<div className="col-lg-12">HERE ARE SUPPOSED TO BE THE COMMENTS</div>
				</div>
			</div>
			{/* <List objects={enrolledstudents} searchParams={searchParams} /> */}
		</>
	);
};

export default CourseCommentsIndex;
