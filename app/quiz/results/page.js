import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/resultlist";

async function getQuizzesResult(params) {
	const res = await fetchurl(`/quizresults${params}`, "GET", "no-cache");
	return res;
}

const QuizzesResultIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getResultsData = getQuizzesResult(
		`?page=${page}&limit=${limit}&sort=${sort}&email=${awtdSearchParams.email}${decrypt}`
	);

	const [results] = await Promise.all([getResultsData]);

	return (
		<>
			<Header
				title={`Quizzes result of ${awtdSearchParams.email}`}
				description="Keep the good job!"
			/>
			<List objects={results} searchParams={awtdSearchParams} />
		</>
	);
};

export default QuizzesResultIndex;
