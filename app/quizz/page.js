import Single from "@/components/quiz/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import NumericPagination from "@/layout/numericpagination";

async function getFeaturedQuizz(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getQuizzes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const QuizIndex = async ({ params, searchParams }) => {
	const getFeaturedQuizzesData = getFeaturedQuizz(
		`?featured=true&status=published`
	);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getQuizzesData = getQuizzes(
		`?page=1&limit=10&sort=-createdAt&status=published`
	);

	const [featured, quizzes] = await Promise.all([
		getFeaturedQuizzesData,
		getQuizzesData,
	]);

	const nextPage = quizzes?.pagination?.next?.page || 0;
	const prevPage = quizzes?.pagination?.prev?.page || 0;

	return (
		<>
			<Header
				title="Welcome to my Quizzes"
				description="Learn everything you need for free!"
			/>
			<div className="container">
				<div className="row">
					<NumericPagination
						nextParams={`page${nextPage}&limit=${limit}`}
						next={nextPage}
						prev={prevPage}
						loadMoreParams={`quiz`}
						pagesArrayInfo={quizzes?.pagination}
						pagePath={searchParams}
						componentMapping={quizzes.data?.map((quiz, index) => (
							<div key={quiz._id} className={`col-lg-3 ${index}`}>
								<Single quiz={quiz} />
							</div>
						))}
					/>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default QuizIndex;
