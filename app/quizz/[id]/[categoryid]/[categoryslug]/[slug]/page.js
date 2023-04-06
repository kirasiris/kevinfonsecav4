import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Loading from "@/app/quizz/loading";
import NumericPagination from "@/layout/numericpagination";
import Single from "@/components/question/single";

async function getQuizz(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`);

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getQuestions(params) {
	const res = await fetch(`http://localhost:5000/api/v1/questions${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const QuizzRead = async ({ params, searchParams }) => {
	const limit = searchParams.limit;
	const page = searchParams.page || 1;

	const getQuizzesData = getQuizz(`/${params.id}`);

	const getQuestionsData = getQuestions(
		`?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published`
	);

	const [quizz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	const nextPage = questions?.pagination?.next?.page || 0;
	const prevPage = questions?.pagination?.prev?.page || 0;

	const startTextButton = () => {
		return (
			<div className="d-grid gap-2 col-12 mt-3 mb-3">
				<Link
					href={{
						pathname: `/quizz/${quizz.data._id}/${quizz?.data.category?._id}/${quizz?.data.category?.slug}/${quizz.data.slug}`,
						query: {
							start: true,
							singlePage: quizz.data.singlePage,
							page: page,
							limit:
								quizz.data.singlePage === false && questions.data.length > 0
									? 1
									: limit,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-secondary btn-lg">Start test</a>
				</Link>
			</div>
		);
	};

	const selectedAnswers = [];

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quizz.data.title} />
			<div className="container">
				<div className="row">
					{searchParams.start !== undefined ? (
						searchParams.singlePage === "false" ? (
							<NumericPagination
								nextParams={`/quizz/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}?start=${searchParams.start}&singlePage=${searchParams.singlePage}&page=${nextPage}&limit=${limit}`}
								prevParams={`/quizz/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}?start=${searchParams.start}&singlePage=${searchParams.singlePage}&page=${prevPage}&limit=${limit}`}
								next={nextPage}
								prev={prevPage}
								pagesArrayInfo={questions?.pagination}
								pagePath={`/quizz/${params.id}/${params.categoryid}/${params.categoryslug}/${params.slug}`}
								pageParams={searchParams}
								componentMapping={questions.data?.map((question) => (
									<Single
										key={question._id}
										question={question}
										selectedAnswers={selectedAnswers}
									/>
								))}
							/>
						) : (
							questions.data?.map((question) => (
								<Single
									key={question._id}
									question={question}
									selectedAnswers={selectedAnswers}
								/>
							))
						)
					) : (
						<div className="col-lg-12">
							<Image
								src={
									quizz.data.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/300x200`
								}
								className="img-fluid w-100 rounded-0"
								alt={`${quizz?.data.title}'s featured image`}
								width={`300`}
								height={`200`}
							/>
							{startTextButton()}
							<h2>Instructions</h2>
							<p>{quizz.data.text}</p>
							<ul className="list-group">
								<li className="list-group-item">
									<p className="m-0">
										Number of questions: {questions.data.length || "0"}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										Category: {quizz.data.category?.title || "No category"}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Duration: {quizz.data.duration}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										Minimum score: {quizz.data.minimumSocre}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										Maximum score: {quizz.data.maximumScore}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Attempts allowed: {quizz.data.attempts}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										{quizz.data.singlePage ? "Single page" : "Multiple pages"}
									</p>
								</li>
							</ul>
							{startTextButton()}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</Suspense>
	);
};

export default QuizzRead;
