import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/layout/header";
import Loading from "@/app/quiz/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";

async function getQuizResult(params) {
	const res = await fetchurl(`/quizresults${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const QuizResultsRead = async ({ params, searchParams }) => {
	const getQuizResultsData = getQuizResult(`/${params.resultid}`);

	const [quizresult] = await Promise.all([getQuizResultsData]);

	const multiplePageLink = () => {
		return (
			<div className="d-grid gap-2 col-12 mt-3 mb-3">
				<Link
					href={{
						pathname: `/quiz/${quizresult?.data?.resourceId?._id}/${quizresult?.data?.resourceId?.category?._id}/${quizresult?.data?.resourceId?.category?.slug}/${quizresult?.data?.resourceId?.slug}/question/multiple`,
						query: {
							page: 1,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-secondary btn-sm">Take&nbsp;test&nbsp;again</a>
				</Link>
			</div>
		);
	};

	const fetchQuotes = () => {
		const quotes = [
			{
				message:
					"Failure is a part of the process. You just learn to pick yourself back up.",
				author: "Michelle Obama",
			},
			{
				message:
					"The secret of life is to fall seven times and to get up eight times.",
				author: "Paulo Coelho",
			},
			{
				message: "Failure is another stepping stone to greatness",
				author: "Oprah Winfrey",
			},
		];

		const randomIndex = Math.floor(Math.random() * quotes.length);

		return (
			<>
				<p>
					Remember,&nbsp;there&nbsp;is&nbsp;no&nbsp;reason&nbsp;to&nbsp;worry&nbsp;about&nbsp;it,&nbsp;this&nbsp;is&nbsp;just&nbsp;a&nbsp;test
					and&nbsp;does&nbsp;not&nbsp;determine&nbsp;your&nbsp;future!.&nbsp;Keep&nbsp;studying&nbsp;and&nbsp;try&nbsp;again!
				</p>
				<blockquote className="failed-test-quotes">
					<p className="failted-test-quotes-paragraph">
						{quotes[randomIndex].message}
					</p>
					<cite className="failted-test-quotes-cite">
						-&nbsp;{quotes[randomIndex].author}
					</cite>
				</blockquote>
			</>
		);
	};

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quizresult.data.resourceId.title} />
			<div className="container">
				{quizresult.data.resourceId.status === "published" ||
				searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses="col-lg-12">
							<article>
								<section>
									{!quizresult?.data?.singlePage && multiplePageLink()}
									<h2>How&nbsp;to&nbsp;read&nbsp;your&nbsp;Score</h2>
									<div className="row">
										<div className="col-lg-3">
											<ul className="list-group mt-2 mb-3">
												<li className="list-group-item">
													<p className="m-0">
														Student&nbsp;Name:&nbsp;
														{quizresult.data.name || "Uknown"}
													</p>
												</li>
												<li className="list-group-item">
													<p className="m-0">
														Score:&nbsp;{quizresult.data.score || "0"}
														&nbsp;questions
													</p>
												</li>
												<li className="list-group-item">
													<p className="m-0">
														Minimum&nbsp;Score&nbsp;to&nbsp;Pass:&nbsp;
														{quizresult.data?.minimumScore || "0"}
													</p>
												</li>
												<li className="list-group-item">
													<p className="m-0">
														Number&nbsp;of&nbsp;questions:&nbsp;
														{quizresult.data?.totalQuestions || "0"}
													</p>
												</li>
												<li className="list-group-item">
													<p className="m-0">
														Final&nbsp;grade:&nbsp;
														{quizresult.data?.grade || "FAIL"}
													</p>
												</li>
											</ul>
										</div>
										<div className="col">
											{quizresult.data.grade === "FAIL" && fetchQuotes()}
										</div>
									</div>
									{!quizresult?.data?.singlePage && multiplePageLink()}
								</section>
							</article>
						</Globalcontent>
					</div>
				) : (
					<p>Not&nbsp;visible</p>
				)}
			</div>
		</Suspense>
	);
};

export default QuizResultsRead;
