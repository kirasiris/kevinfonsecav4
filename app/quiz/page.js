import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/list";

async function getFeaturedQuiz(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	return res;
}

async function getQuizzes(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const QuizIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedQuizData = getFeaturedQuiz(
		`?featured=true&status=published${decrypt}`
	);

	const getQuizzesData = getQuizzes(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const getCategoriesData = getCategories(`?categoryType=quiz`);

	const [featured, quizzes, categories] = await Promise.all([
		getFeaturedQuizData,
		getQuizzesData,
		getCategoriesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Quizzes"
				description="Learn everything you need for free!"
			/>
			<List
				featured={featured}
				objects={quizzes}
				searchParams={awtdSearchParams}
				categories={categories}
			/>
		</>
	);
};

export default QuizIndex;
