import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Loading from "@/app/blog/loading";
import ExportModal from "@/layout/exportmodal";

async function getQuizz(params) {
	const res = await fetch(`http://localhost:5000/api/v1/quizzes${params}`, {
		cache: "no-store",
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

const QuizzRead = async ({ params }) => {
	const getQuizzesData = getQuizz(`/${params.id}`);

	const getQuestionsData = getQuestions(`?resourceId=6419346dd77dc3f76ae72909`);

	const [quizz, questions] = await Promise.all([
		getQuizzesData,
		getQuestionsData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={quizz.data.title} />
			<div className="container">
				<div className="row">
					<div className={`col-lg-12`}>
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
						<h2>Instructions</h2>
						<p>{quizz.data.text}</p>
						<ul className="list-group">
							<li className="list-group-item">
								<p className="m-0">
									Category: {quizz.data.category?.title || "No category"}
								</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Duration: {quizz.data.duration}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Minimum score: {quizz.data.minimumSocre}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Maximum score: {quizz.data.maximumScore}</p>
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
						<pre>{JSON.stringify(quizz, null, 4)}</pre>
						<pre>{JSON.stringify(questions, null, 4)}</pre>
						<ExportModal
							linkToShare={`localhost:3000/quizz/${quizz.data._id}/${quizz.data.category?._id}/${quizz.data.category?.slug}/${quizz.data.slug}`}
							object={quizz.data}
						/>
					</div>
				</div>
			</div>
			<Footer />
		</Suspense>
	);
};

export default QuizzRead;
