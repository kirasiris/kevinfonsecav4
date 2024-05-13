"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const UpdateQuiz = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (params = "") => {
		try {
			const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
			setCategories(res?.data);
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
				const res = await fetchurl(`/quizzes/${quizId}`, "GET", "no-cache");
				setQuiz(res?.data);
				setQuizData({
					title: res?.data?.title,
					avatar: res?.data?.files?.avatar,
					text: res?.data?.text,
					duration: res?.data?.duration,
					minimumScore: res?.data?.minimumScore,
					maximumScore: res?.data?.maximumScore,
					featured: res?.data?.featured,
					embedding: res?.data?.embedding,
					category: res?.data?.category,
					commented: res?.data?.commented,
					// password: res?.data?.password,
					status: res?.data?.status,
					attempts: res?.data?.attempts,
					singlePage: res?.data?.singlePage,
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
			await fetchurl(`/quizzes/${quiz._id}`, "PUT", "no-cache", {
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
					github_readme={""}
					category={category._id ? category._id : category}
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
