import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/course/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getCourses(params) {
	const res = await fetchurl(
		`/extras/stripe/courses${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const CourseSubCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedCoursesData = getCourses(
		`?featured=true&status=published${decrypt}`,
	);

	const getCoursesData = getCourses(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&sub_category=${awtdParams.subcategory}${decrypt}`,
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	const capitalizeWord = awtdParams.subcategory
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${capitalizeWord}`}
				description={`${capitalizeWord} search results`}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/course/subcategory/${awtdParams.category}?page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title={`Welcome to my ${capitalizeWord} Courses`}
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

export default CourseSubCategoryIndex;
