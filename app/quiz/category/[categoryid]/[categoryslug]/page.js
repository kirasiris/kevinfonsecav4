import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getQuizzes(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const QuizCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedQuizData = getQuizzes(
		`?featured=true&status=published${decrypt}`,
	);

	const getQuizzesData = getQuizzes(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&category=${awtdParams.categoryid}${decrypt}`,
	);

	const getCategoriesData = getCategories(`?categoryType=quiz`);

	const [featured, quizzes, categories] = await Promise.all([
		getFeaturedQuizData,
		getQuizzesData,
		getCategoriesData,
	]);

	const capitalizeWord = awtdParams.categoryslug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${capitalizeWord}`}
				description={`${capitalizeWord} search results...`}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/quiz/category/${awtdParams.categoryid}/${awtdParams.categoryslug}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="blog"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title={`Welcome to my ${capitalizeWord} Quizzes`}
						description="Learn everything you need for free!"
					/>
					<List
						featured={featured}
						objects={quizzes}
						searchParams={awtdSearchParams}
						categories={categories}
					/>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default QuizCategoryIndex;
