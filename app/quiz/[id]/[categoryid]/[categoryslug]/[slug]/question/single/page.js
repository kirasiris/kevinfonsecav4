import { Suspense } from "react";
import { notFound } from "next/navigation";
// import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Loading from "@/app/quiz/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
// import CommentBox from "@/components/global/commentbox";
// import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
// import ArticleHeader from "@/components/global/articleheader";
// import Single from "@/components/question/single";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getQuiz(params) {
	const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/questions${params}`, "GET", "no-cache");
	return res;
}

const QuizSinglePageRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getQuizzesData = getQuiz(`/${params.id}`);

	const getQuestionsData = getQuestions(
		`?resourceId=${params.id}&page=${searchParams.page}&sort=-createdAt&status=published`
	);

	const [quiz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quiz.data.title} />
			<div className="container">
				{quiz.data.status === "published" || searchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses="col-lg-12">
							<article>
								<section className="mb-5">
									{questions?.data?.length > 0 &&
										questions?.data.map((question, index) => (
											<div key={question._id} className="row">
												<div className={`col ${index}`}>
													<figure>
														<Image
															src={
																question.files?.avatar?.location
																	?.secure_location ||
																`https://source.unsplash.com/random/300x200`
															}
															className="img-fluid w-100 rounded-0"
															alt={`${question.title}'s featured image`}
															width={`300`}
															height={`200`}
														/>
													</figure>
													{/* <ParseHtml text={question.text} /> */}
												</div>
												<div className="col-lg-8">
													<h2>{question.title}</h2>
													{Object.entries(question.answers).map(
														([key, value]) => (
															<div key={question.answers[key]}>
																<input
																	id={`${question.answers[key]}`}
																	type="radio"
																	name={`correctAnswer_${question._id}`}
																/>
																<label htmlFor={`${question.answers[key]}`}>
																	{question.answers[key]}
																</label>
															</div>
														)
													)}
												</div>
											</div>
										))}
									<hr />
									<div className="float-start">
										{quiz?.data?.category && (
											<ExportModal
												linkToShare={`localhost:3000/quiz/${quiz?.data?._id}/${quiz?.data?.category?._id}/${quiz?.data?.category.slug}/${quiz?.data?.slug}`}
												object={quiz?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											postId={quiz?.data?._id}
											postType="quiz"
											onModel="Quiz"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={quiz?.data?.user} />
									{/* <CommentBox
										auth={auth.data}
										user={quiz?.data?.user}
										postId={quiz?.data?._id}
										secondPostId={quiz?.data?._id}
										isVisible={quiz?.data?.commented}
										postType="quiz"
										onModel="Quiz"
									/> */}
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

export default QuizSinglePageRead;
