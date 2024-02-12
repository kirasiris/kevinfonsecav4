import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";

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

	const myParams = {
		category: course.data.category,
		subcategory: course.data.sub_category,
	};

	return (
		<Suspense fallback={<Loading />}>
			<Header title={course.data.title} description={course.data.sub_title} />
			<List
				object={course}
				objects={lessons}
				isAdmin={false}
				params={myParams}
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
