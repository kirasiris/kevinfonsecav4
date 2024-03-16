import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/list";

async function getFeaturedQuiz(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	return res.json();
}

async function getQuizzes(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	return res.json();
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res.json();
}

const QuizSearchIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedQuizData = getFeaturedQuiz(
		`?featured=true&status=published${decrypt}`
	);

	const getQuizzesData = getQuizzes(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published&keyword=${searchParams.keyword}${decrypt}`
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
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List
				featured={featured}
				objects={quizzes}
				searchParams={searchParams}
				categories={categories}
			/>
		</>
	);
};

export default QuizSearchIndex;
