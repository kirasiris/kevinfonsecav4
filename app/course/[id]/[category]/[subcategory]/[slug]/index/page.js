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
	return res.json();
}

async function getCourseLessons(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/videos${params}&sort=-orderingNumber`
	);
	return res.json();
}

const CourseLessonsIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getCoursesData = getCourse(`/${params.id}`);
	const getCourseLessonsData = getCourseLessons(
		`?resourceId=${params.id}&onModel=Course`
	);

	const [course, lessons] = await Promise.all([
		getCoursesData,
		getCourseLessonsData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={course.data.title} description={course.data.sub_title} />
			<List
				object={course}
				objects={lessons}
				isAdmin={false}
				params={params}
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
