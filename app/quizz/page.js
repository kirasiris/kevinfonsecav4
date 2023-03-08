import Single from "@/components/me/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedQuizz(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getQuizzes(params) {
	const res = await fetch(`http://localhost:5000/api/v1/posts${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const QuizIndex = async () => {
	const getFeaturedQuizzesData = getFeaturedQuizz(
		`?featured=true&status=published`
	);

	const getQuizzesData = getQuizzes(
		`?page=1&limit=10&sort=-createdAt&status=published`
	);

	// const [featured, quizzes] = await Promise.all([
	// 	getFeaturedQuizzesData,
	// 	getQuizzesData,
	// ]);

	return (
		<>
			<Header
				title="Welcome to my Quizzes"
				description="Learn everything you need for free!"
			/>
			<div className="container">
				<div className="row">
					<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
						HERE GOES THE QUIZZES
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default QuizIndex;
