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
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedCoursesData = getFeaturedCourse(
		`?featured=true&status=published${decrypt}`
	);

	const getCoursesData = getCourses(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&category=${awtdParams.category}${decrypt}`
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	const capitalizeWord = awtdParams.category;

	return (
		<>
			<Header
				title={`Welcome to my ${capitalizeWord
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")} Courses`}
				description="Learn everything about my programming and life journey"
			/>
			<List
				featured={featured}
				objects={courses}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default CourseCategoryIndex;
