"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";

const ReadQuiz = () => {
	const router = useRouter();

	const [quiz, setQuiz] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const quizId = id;

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const res = await axios.get(`/quizzes/${quizId}`);
				setQuiz(res?.data?.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};

		const fetchQuestions = async () => {
			try {
				const res = await axios.get(
					`/questions?resourceId=${quizId}&sort=orderingNumber`
				);
				setQuestions(res?.data?.data);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchQuiz();
		fetchQuestions();
	}, [quizId]);

	const updateOrder = async (e, index) => {
		e.dataTransfer.setData("itemIndex", index.toString());
	};

	const updateDrop = async (e, index) => {
		const movingItemIndex = e.dataTransfer.getData("itemIndex");
		const targetItemIndex = index;

		let allQuestions = questions; // Create a copy of the questions array

		let movingItem = allQuestions[movingItemIndex];
		let targetItem = allQuestions[targetItemIndex];

		if (movingItem.orderingNumber !== targetItem.orderingNumber) {
			// Only update the ordering numbers if they are different

			// Switch the ordering numbers of the moving item and the target item
			const tempOrderingNumber = movingItem.orderingNumber;
			movingItem.orderingNumber = targetItem.orderingNumber;
			targetItem.orderingNumber = tempOrderingNumber;

			// Update the ordering numbers in the backend
			await axios.put(`/questions/${movingItem._id}/updateorder`, {
				index: movingItem.orderingNumber, // Update the moving item's ordering number
			});
			await axios.put(`/questions/${targetItem._id}/updateorder`, {
				index: targetItem.orderingNumber, // Update the target item's ordering number
			});
		}

		allQuestions.splice(movingItemIndex, 1); // Remove the moving item from the original position
		allQuestions.splice(targetItemIndex, 0, movingItem); // Insert the moving item at the target position

		setQuestions([...questions], allQuestions);
	};

	return loading || quiz === null || quiz === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{quiz.title}</div>
					<div className="card-body">
						<ParseHtml text={quiz.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Questions</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/quizzes/question/${quiz._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">
										Add question
									</a>
								</Link>
							</div>
						</div>
					</div>
					{questions?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
							onDragOver={(e) => e.preventDefault()}
						>
							{questions.map((question, index) => (
								<li
									key={question._id}
									className={`list-group-item ${question.orderingNumber}`}
									draggable
									onDragStart={(e) => updateOrder(e, index)}
									onDrop={(e) => updateDrop(e, index)}
								>
									<div className="float-start">
										<Link
											href={`/question/${question._id}/${question.slug}`}
											passHref
											legacyBehavior
										>
											<a target="_blank">
												<span className="badge bg-secondary me-1">
													{question.orderingNumber}
												</span>
												{question.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										<span className="badge bg-info me-1">
											Correct Answer: {question.correctAnswer}
										</span>
										<span className="badge bg-secondary me-1">
											{question.onModel}
										</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className="alert alert-danger rounded-0  m-0 border-0">
							Nothing found
						</div>
					)}
				</div>
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							quiz?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${quiz?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadQuiz;
