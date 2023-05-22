// "use client";
import {
	Suspense,
	// useEffect, useState
} from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Loading from "@/app/quizz/loading";
import NumericPagination from "@/layout/numericpagination";
import Single from "@/components/question/single";

async function getQuizz(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`, {
		cache: "force-cache",
	});

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

	const [quiz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	const nextPage = questions?.pagination?.next?.page || 0;
	const prevPage = questions?.pagination?.prev?.page || 0;

	const selectedAnswers = [];
	// const setSelectedAnswers = () => {};

	// const [quiz, setQuiz] = useState(null);
	// const [loading, setLoading] = useState(true);
	// const [questions, setQuestions] = useState([]);
	// const [limit, setLimit] = useState(searchParams.limit);
	// const [page, setPage] = useState(searchParams.page || limit);
	// const [nextPage, setNextPage] = useState(0);
	// const [prevPage, setPrevPage] = useState(0);
	// const [selectedAnswers, setSelectedAnswers] = useState([]);

	// useEffect(() => {
	// 	const fetchQuiz = async () => {
	// 		const res = await fetch(
	// 			`http://localhost:5000/api/v1/quizzes/${params.id}`
	// 		);
	// 		const data = await res.json();
	// 		setQuiz(data);
	// 		setLoading(false);
	// 	};
	// 	fetchQuiz();

	// 	const fetchQuestions = async () => {
	// 		const res = await fetch(
	// 			`http://localhost:5000/api/v1/questions?resourceId=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published`
	// 		);
	// 		const data = await res.json();
	// 		setQuestions(data);
	// 	};
	// 	fetchQuestions();
	// 	setLimit(searchParams.limit);
	// 	setPage(searchParams.page || limit);
	// 	setNextPage(questions?.pagination?.next?.page || 0);
	// 	setPrevPage(questions?.pagination?.prev?.page || 0);
	// }, [params.id, searchParams.page]);

	// if (loading) {
	// 	return <>Loading...</>;
	// }

	const startTextButton = () => {
		return (
			<div className="d-grid gap-2 col-12 mt-3 mb-3">
				<Link
					href={{
						pathname: `/quizz/${quiz.data._id}/${quiz?.data.category?._id}/${quiz?.data.category?.slug}/${quiz.data.slug}`,
						query: {
							start: true,
							singlePage: quiz.data.singlePage,
							page: page,
							limit:
								quiz.data.singlePage === false && questions.data?.length > 0
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

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quiz.data.title} />
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
										// setSelectedAnswers={setSelectedAnswers}
									/>
								))}
							/>
						) : (
							questions.data?.map((question) => (
								<Single
									key={question._id}
									question={question}
									selectedAnswers={selectedAnswers}
									// setSelectedAnswers={setSelectedAnswers}
								/>
							))
						)
					) : (
						<div className="col-lg-12">
							<Image
								src={
									quiz.data.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/300x200`
								}
								className="img-fluid w-100 rounded-0"
								alt={`${quiz?.data.title}'s featured image`}
								width={`300`}
								height={`200`}
								priority
							/>
							{startTextButton()}
							<h2>Instructions</h2>
							<p>{quiz.data.text}</p>
							<ul className="list-group">
								<li className="list-group-item">
									<p className="m-0">
										Number of questions: {questions.data?.length || "0"}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										Category: {quiz.data.category?.title || "No category"}
									</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Duration: {quiz.data.duration}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Minimum score: {quiz.data.minimumSocre}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Maximum score: {quiz.data.maximumScore}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">Attempts allowed: {quiz.data.attempts}</p>
								</li>
								<li className="list-group-item">
									<p className="m-0">
										{quiz.data.singlePage ? "Single page" : "Multiple pages"}
									</p>
								</li>
							</ul>
							{startTextButton()}
						</div>
					)}
				</div>
			</div>
		</Suspense>
	);
};

export default QuizzRead;
