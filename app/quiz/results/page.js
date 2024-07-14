import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/resultlist";

async function getQuizzesResult(params) {
	const res = await fetchurl(`/quizresults${params}`, "GET", "no-cache");
	return res;
}

const QuizzesResultIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getResultsData = getQuizzesResult(
		`?page=${page}&limit=${limit}&sort=${sort}&email=${searchParams.email}${decrypt}`
	);

	const [results] = await Promise.all([getResultsData]);

	return (
		<>
			<Header
				title={`Quizzes result of ${searchParams.email}`}
				description="Keep the good job!"
			/>
			<List objects={results} searchParams={searchParams} />
		</>
	);
};

export default QuizzesResultIndex;
