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

const CourseSearchIndex = async ({ params, searchParams }) => {
	// const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedCoursesData = getFeaturedCourse(
		`?featured=true&status=published${decrypt}`
	);

	const getCoursesData = getCourses(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	return (
		<>
			<Header
				title={`${awtdSearchParams.keyword}`}
				description="Search results"
			/>
			<List
				featured={featured}
				objects={courses}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default CourseSearchIndex;
