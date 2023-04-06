"use client";
import { Suspense } from "react";
import Image from "next/image";
import Loading from "@/app/quizz/loading";

const Single = ({
	question = {},
	selectedAnswers = [],
	setSelectedAnswers,
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${question._id} row`}>
				<div className={`col`}>
					<Image
						src={
							question.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/300x200`
						}
						className="img-fluid w-100 rounded-0"
						alt={`${question.title}'s featured image`}
						width={`300`}
						height={`200`}
					/>
				</div>
				<div className={`col`}>
					<h2>{question.title}</h2>
					{Object.entries(question.answers).map(([key, value]) => (
						<div
							key={key}
							className="form-check"
							onClick={(e) => {
								e.preventDefault();
								// setSelectedAnswers({
								// 	...selectedAnswers,
								// 	key,
								// });
								selectedAnswers.push([...selectedAnswers, key]);
							}}
						>
							<input
								className="form-check-input"
								type="radio"
								name="correctAnswer"
								id={key}
							/>
							<label className="form-check-label" htmlFor={key}>
								{key} - {value}
							</label>
						</div>
					))}
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
