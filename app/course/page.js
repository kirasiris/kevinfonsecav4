import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/course/list";
import ErrorPage from "@/layout/errorpage";
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

const CourseIndex = async ({ params, searchParams }) => {
	// const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedCoursesData = getCourses(
		`?featured=true&status=published${decrypt}`,
	);

	const getCoursesData = getCourses(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`,
	);

	const [featured, courses] = await Promise.all([
		getFeaturedCoursesData,
		getCoursesData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Courses`}
				description={"Courses at your reach"}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/course`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="Welcome to my Courses"
						description="Courses at your reach"
					/>
					<List
						featured={featured}
						objects={courses}
						searchParams={awtdSearchParams}
					/>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default CourseIndex;
