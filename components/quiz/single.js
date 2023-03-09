import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";

const Single = ({ quiz = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={quiz._id}>
				<div className={`card mb-3`}>
					<div className="card-header">
						<Link
							href={{
								pathname: `/quizz/${quiz._id}/${quiz?.category?._id}/${quiz?.category?.slug}/${quiz.slug}`,
							}}
							passHref
							legacyBehavior
						>
							<a>{quiz.title}</a>
						</Link>
					</div>
					<div className="card-body p-0">
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								<p className="m-0">
									Category: {quiz.category?.title || "No category"}
								</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Duration: {quiz.duration}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Minimum score: {quiz.minimumSocre}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Maximum score: {quiz.maximumScore}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Attempts allowed: {quiz.attempts}</p>
							</li>
						</ul>
					</div>
					<div className="card-footer">
						<Link
							href={{
								pathname: `/quizz/${quiz._id}/${quiz?.category?._id}/${quiz?.category?.slug}/${quiz.slug}`,
							}}
							passHref
							legacyBehavior
						>
							<a className="float-end">Take test</a>
						</Link>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
