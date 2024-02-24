"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdateQuiz = () => {
	const { files } = useContext(AuthContext);

	const router = useRouter();

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (params = "") => {
		try {
			const res = await axios.get(`/categories${params}`);
			setCategories(res?.data?.data);
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	useEffect(() => {
		fetchCategories(`?categoryType=quiz`);
	}, []);

	const [quizData, setQuizData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		duration: 0,
		minimumScore: 3,
		maximumScore: 100,
		featured: true,
		embedding: true,
		category: undefined,
		commented: true,
		password: ``,
		status: `draft`,
		attempts: 1,
		singlePage: true,
	});
	const {
		title,
		avatar,
		text,
		duration,
		minimumScore,
		maximumScore,
		featured,
		embedding,
		category,
		commented,
		password,
		status,
		attempts,
		singlePage,
	} = quizData;

	const [quiz, setQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const quizId = id;

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const res = await axios.get(`/quizzes/${quizId}`);
				setQuiz(res?.data?.data);
				setQuizData({
					title: res?.data?.data?.title,
					avatar: res?.data?.data?.files?.avatar,
					text: res?.data?.data?.text,
					duration: res?.data?.data?.duration,
					minimumScore: res?.data?.data?.minimumScore,
					maximumScore: res?.data?.data?.maximumScore,
					featured: res?.data?.data?.featured,
					embedding: res?.data?.data?.embedding,
					category: res?.data?.data?.category,
					commented: res?.data?.data?.commented,
					// password: res?.data?.data?.password,
					status: res?.data?.data?.status,
					attempts: res?.data?.data?.attempts,
					singlePage: res?.data?.data?.singlePage,
				});
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
		fetchQuiz();
	}, [quizId]);

	const upgradeQuiz = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/quizzes/${quiz._id}`, {
				...quizData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			resetForm();
			router.push(`/noadmin/quizzes`);
		} catch (err) {
			console.log(err);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setQuizData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: `No description`,
			duration: 0,
			minimumScore: 3,
			maximumScore: 100,
			featured: true,
			embedding: true,
			category: undefined,
			commented: true,
			password: ``,
			status: `draft`,
			attempts: 1,
			singlePage: true,
		});
	};

	return loading || quiz === null || quiz === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading</>
		)
	) : (
		<form className="row" onSubmit={upgradeQuiz}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setQuizData({
							...quizData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={quizData}
					setObjectData={setQuizData}
					onModel="Quizz"
					advancedTextEditor={false}
				/>
				<div className="row">
					<div className="col">
						<div className="col">
							<label htmlFor="duration" className="form-label">
								Duration
							</label>
							<input
								id="duration"
								name="duration"
								value={duration}
								onChange={(e) => {
									setQuizData({
										...quizData,
										duration: e.target.value,
									});
								}}
								type="number"
								className="form-control mb-3"
								placeholder=""
								min="1"
								max="100"
							/>
						</div>
					</div>
					<div className="col">
						<label htmlFor="minimumScore" className="form-label">
							Minimum Score
						</label>
						<input
							id="minimumScore"
							name="minimumScore"
							value={minimumScore}
							onChange={(e) => {
								setQuizData({
									...quizData,
									minimumScore: e.target.value,
								});
							}}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
					<div className="col">
						<label htmlFor="maximumScore" className="form-label">
							Maximum Score
						</label>
						<input
							id="maximumScore"
							name="maximumScore"
							value={maximumScore}
							onChange={(e) => {
								setQuizData({
									...quizData,
									maximumScore: e.target.value,
								});
							}}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="attempts" className="form-label">
							Attempts
						</label>
						<input
							id="attempts"
							name="attempts"
							value={attempts}
							onChange={(e) => {
								setQuizData({
									...quizData,
									attempts: e.target.value,
								});
							}}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
						/>
					</div>
					<div className="col">
						<label htmlFor="singlePage" className="form-label">
							Single Page
						</label>
						<select
							id="singlePage"
							name="singlePage"
							value={singlePage}
							onChange={(e) => {
								setQuizData({
									...quizData,
									singlePage: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={avatar}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					categories={categories}
					objectData={quizData}
					setObjectData={setQuizData}
					multipleFiles={false}
					onModel={"Quizz"}
				/>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={title.length > 0 && text.length > 0 ? !true : !false}
				>
					Submit
				</button>
				<button
					type="button"
					className="btn btn-secondary btn-sm float-end"
					onClick={resetForm}
				>
					Reset
				</button>
			</div>
		</form>
	);
};

export default UpdateQuiz;
