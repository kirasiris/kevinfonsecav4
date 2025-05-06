import { Suspense } from "react";
import { notFound } from "next/navigation";
import Header from "@/layout/header";
import Loading from "@/app/quiz/loading";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import List from "@/components/quiz/multiplepagequestionlist";

// async function getAuthenticatedUser() {
// 	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
// 	return res;
// }

async function getQuiz(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/global/questions${params}`, "GET", "no-cache");
	return res;
}

const QuizMultiplePageRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 1;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const auth = await getUserOnServer();

	const getQuizzesData = getQuiz(`/${awtdParams.id}`);

	const getQuestionsData = getQuestions(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&decrypt=true`
	);

	const [quiz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quiz.data.title} />
			<div className="container">
				{quiz.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses="col-lg-12">
							<article>
								<section className="mb-4">
									<List
										object={quiz}
										objects={questions}
										params={awtdParams}
										searchParams={awtdSearchParams}
									/>
								</section>
							</article>
						</Globalcontent>
					</div>
				) : (
					<p>Not visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default QuizMultiplePageRead;
