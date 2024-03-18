import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/course/list";

async function getFeaturedCourse(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
}

async function getCourses(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
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

	const capitalizeWord = params.category;

	return (
		<>
			<Header
				title={`Welcome to my ${
					capitalizeWord.charAt(0).toUpperCase() + capitalizeWord.slice(1)
				} Courses`}
				description="Learn everything about my programming and life journey"
			/>
			<List featured={featured} objects={courses} searchParams={searchParams} />
		</>
	);
};

export default CourseCategoryIndex;
