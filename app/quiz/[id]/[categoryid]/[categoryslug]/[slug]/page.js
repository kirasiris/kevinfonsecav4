import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Loading from "@/app/quiz/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
// import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import NewsletterForm from "@/components/global/newsletter";
import ParseHtml from "@/layout/parseHtml";
import Head from "@/app/head";

async function getQuiz(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQuestions(params) {
	const res = await fetchurl(`/global/questions${params}`, "GET", "no-cache");
	return res;
}

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	return res;
}

const QuizRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 15;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getQuizzesData = getQuiz(`/${awtdParams.id}`);

	const getQuestionsData = getQuestions(
		`?resourceId=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published`
	);

	const [quiz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	const singlePageLink = () => {
		return (
			<div className="d-grid gap-2 col-12 mt-3 mb-3">
				<Link
					href={{
						pathname: `/quiz/${quiz?.data?._id}/${quiz?.data?.category?._id}/${quiz?.data?.category?.slug}/${quiz?.data?.slug}/question/single`,
						query: {
							page: 1,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-secondary btn-sm">Start test</a>
				</Link>
			</div>
		);
	};

	const multiplePageLink = () => {
		return (
			<div className="d-grid gap-2 col-12 mt-3 mb-3">
				<Link
					href={{
						pathname: `/quiz/${quiz?.data?._id}/${quiz?.data?.category?._id}/${quiz?.data?.category?.slug}/${quiz?.data?.slug}/question/multiple`,
						query: {
							page: 1,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-secondary btn-sm">Start test</a>
				</Link>
			</div>
		);
	};

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={quiz.data.title}
				description={quiz.data.excerpt || quiz.data.text}
				// favicon=""
				postImage={quiz.data.files.avatar.location.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category={quiz.data.category.title}
				url={`/quiz/${quiz.data._id}/${quiz.data.category._id}/${quiz.data.category.slug}/${quiz.data.slug}`}
				author={quiz.data.user.name}
				createdAt={quiz.data.createdAt}
				updatedAt={quiz.data.updatedAt}
				locales=""
				posType="quiz"
			/>
			<Header title={quiz.data.title} />
			<div className="container">
				{quiz.data.status === "published" ||
				awtdSearchParams.isAdmin === "true" ? (
					<div className="row">
						<Globalcontent containerClasses="col-lg-12">
							<article>
								<ArticleHeader
									object={quiz}
									url={`/quiz/category/${quiz?.data?.category?._id}/${quiz?.data?.category?.slug}`}
								/>
								<figure className="mb-4">
									<Image
										src={
											quiz.data.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/300x200`
										}
										className="img-fluid w-100 rounded-0"
										alt={`${quiz?.data.title}'s featured image`}
										width={`300`}
										height={`200`}
										priority
									/>
								</figure>
								<section>
									{quiz?.data?.singlePage && singlePageLink()}
									{!quiz?.data?.singlePage && multiplePageLink()}
									<h2>Instructions</h2>
									<ParseHtml text={quiz?.data?.text} />
									<ul className="list-group mt-2">
										<li className="list-group-item">
											<p className="m-0">
												Number&nbsp;of&nbsp;questions:&nbsp;
												{questions.data?.length || "0"}
											</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">
												Category:&nbsp;
												{quiz.data.category?.title || "No category"}
											</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">Duration:&nbsp;{quiz.data.duration}</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">
												Minimum&nbsp;score:&nbsp;{quiz.data.minimumScore}
											</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">
												Maximum&nbsp;score:&nbsp;{quiz.data.maximumScore}
											</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">
												Attempts&nbsp;allowed:&nbsp;{quiz.data.attempts}
											</p>
										</li>
										<li className="list-group-item">
											<p className="m-0">
												Format:&nbsp;
												{quiz.data.singlePage
													? "Single page"
													: "Multiple pages"}
											</p>
										</li>
									</ul>
									{quiz?.data?.singlePage && singlePageLink()}
									{!quiz?.data?.singlePage && multiplePageLink()}
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
									<div className="float-start">
										{quiz?.data?.category && (
											<ExportModal
												linkToShare={`/quiz/${quiz?.data?._id}/${quiz?.data?.category?._id}/${quiz?.data?.category.slug}/${quiz?.data?.slug}`}
												object={quiz?.data}
											/>
										)}
									</div>
									<div className="float-end">
										<ReportModal
											resourceId={quiz?.data?._id}
											postType="quiz"
											onModel="Quiz"
										/>
									</div>
									<div style={{ clear: "both" }} />
									<AuthorBox author={quiz?.data?.user} />
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

export default QuizRead;
