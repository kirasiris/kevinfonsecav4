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

const CourseSearchIndex = async ({ params, searchParams }) => {
	// const awtdParams = await params;
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
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`,
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${awtdSearchParams.keyword}`}
				description={"Search results..."}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/course/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
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
