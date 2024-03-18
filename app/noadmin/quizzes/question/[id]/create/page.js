"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateQuestion = ({ params }) => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [questionData, setQuestionData] = useState({
		title: `Untitled`,
		text: `No description`,
		password: ``,
		status: `draft`,
		correctAnswer: "",
		answers: {},
	});

	const { title, text, password, status, correctAnswer, answers } =
		questionData;

	const addQuestion = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/questions`, {
				...questionData,
				resourceId: params.id,
				files: { avatar: files?.selected?._id },
				onModel: "Quiz",
			});
			router.push(`/noadmin/quizzes/read/${params.id}`);
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
		setQuestionData({
			title: `Untitled`,
			text: `No description`,
			password: ``,
			status: `draft`,
			correctAnswer: "",
			answers: {},
		});
	};

	return (
		<form className="row" onSubmit={addQuestion}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setQuestionData({
							...questionData,
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
					objectData={questionData}
					setObjectData={setQuestionData}
					onModel="question"
					advancedTextEditor={false}
				/>
				<label htmlFor="correctAnswer" className="form-label">
					Correct Answer
				</label>
				<input
					id="correctAnswer"
					name="correctAnswer"
					value={correctAnswer}
					onChange={(e) => {
						setQuestionData({
							...questionData,
							correctAnswer: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="answersA" className="form-label">
							Answer A
						</label>
						<input
							id="answersA"
							name="answersA"
							value={answers.A}
							onChange={(e) => {
								setQuestionData({
									...questionData,
									answers: {
										...answers,
										A: e.target.value,
									},
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersB" className="form-label">
							Answer B
						</label>
						<input
							id="answersB"
							name="answersB"
							value={answers.B}
							onChange={(e) => {
								setQuestionData({
									...questionData,
									answers: {
										...answers,
										B: e.target.value,
									},
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="answersC" className="form-label">
							Answer C
						</label>
						<input
							id="answersC"
							name="answersC"
							value={answers.C}
							onChange={(e) => {
								setQuestionData({
									...questionData,
									answers: {
										...answers,
										C: e.target.value,
									},
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersD" className="form-label">
							Answer D
						</label>
						<input
							id="answersD"
							name="answersD"
							value={answers.D}
							onChange={(e) => {
								setQuestionData({
									...questionData,
									answers: {
										...answers,
										D: e.target.value,
									},
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={files?.selected?._id}
					status={status}
					fullWidth={false}
					password={password}
					featured={false}
					commented={false}
					embedding={false}
					github={false}
					category={undefined}
					categories={[]}
					objectData={questionData}
					setObjectData={setQuestionData}
					multipleFiles={false}
					onModel={"Question"}
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

export default CreateQuestion;
