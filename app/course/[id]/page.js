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

const CourseRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&sort=-orderingNumber&onModel=Course`
	);

	const [course, lessons] = await Promise.all([
		getCoursesData,
		getCourseLessonsData,
	]);

	const myParams = {
		category: course?.data?.category,
		subcategory: course?.data?.sub_category,
	};

	return (
		<Suspense fallback={<Loading />}>
			<Jumbotron
				object={course}
				params={myParams}
				imageWidth="440"
				imageHeight="570"
			/>
			<List
				object={course}
				objects={lessons}
				isAdmin={false}
				searchParams={searchParams}
				isIndex={true}
				linkToShare={`localhost:3000/course/${course?.data?._id}`}
				postType="course"
				onModel="Course"
			/>
		</Suspense>
	);
};

export default CourseRead;
