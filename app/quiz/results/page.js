import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/quiz/resultlist";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getQuizzesResult(params) {
	const res = await fetchurl(`/global/quizresults${params}`, "GET", "no-cache");
	return res;
}

const QuizzesResultIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getResultsData = getQuizzesResult(
		`?page=${page}&limit=${limit}&sort=${sort}&email=${awtdSearchParams.email}${decrypt}`,
	);

	const [results] = await Promise.all([getResultsData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Quiz Results`}
				description="Keep the good job!"
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/quiz/results`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title={`Quiz results of ${awtdSearchParams.email}`}
						description="Keep the good job!"
					/>
					<List objects={results} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default QuizzesResultIndex;
