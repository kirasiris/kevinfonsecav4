import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/course/list";

async function getFeaturedCourse(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

async function getCourses(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/courses${params}`);
	return res.json();
}

const CourseCategoryIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 32;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedCoursesData = getFeaturedCourse(
		`?featured=true&status=published${decrypt}`
	);

	const getCoursesData = getCourses(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published&category=${params.category}${decrypt}`
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Courses"
				description="Learn everything about my programming and life journey"
			/>
			<List featured={featured} objects={courses} searchParams={searchParams} />
		</>
	);
};

export default CourseCategoryIndex;