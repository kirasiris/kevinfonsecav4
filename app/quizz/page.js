import Single from "@/components/quizz/single";
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

const QuizzIndex = async ({ searchParams }) => {
	const getFeaturedQuizzesData = getFeaturedQuizz(
		`?featured=true&status=published`
	);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getQuizzesData = getQuizzes(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published`
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
					{quizzes?.data?.length > 0 && (
						<NumericPagination
							nextParams={`/quizz?page=${nextPage}&limit=${limit}`}
							prevParams={`/quizz?page=${prevPage}&limit=${limit}`}
							next={nextPage}
							prev={prevPage}
							loadMoreParams={`quizz`}
							pagesArrayInfo={quizzes?.pagination}
							pagePath="/quizz"
							pageParams={searchParams}
							componentMapping={quizzes.data?.map((quizz) => (
								<Single key={quizz._id} quizz={quizz} />
							))}
						/>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default QuizzIndex;
