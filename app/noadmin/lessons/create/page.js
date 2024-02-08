"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateLesson = () => {
	const { auth, files } = useContext(AuthContext);

	const router = useRouter();

	const [categories, setCategories] = useState([]);

	const [courses, setCourses] = useState([]);

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
		fetchCategories(`?categoryType=lesson`);
	}, []);

	const fetchCourses = async (params = "") => {
		try {
			const res = await axios.get(`/courses${params}`);
			setCourses(res?.data?.data);
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
		fetchCourses(`?page=1&sort=-createdAt`);
	}, []);

	const [lessonData, setLessonData] = useState({
		resourceId: 0,
		title: `Untitled`,
		text: `No description`,
		featured: false,
		commented: false,
		embedding: false,
		category: undefined,
		password: ``,
		status: `draft`,
		video_url: ``,
		free_preview: false,
		language: "english",
		duration: 0,
	});
	const {
		resourceId,
		title,
		avatar,
		text,
		featured,
		commented,
		embedding,
		category,
		password,
		status,
		video_url,
		free_preview,
		language,
		duration,
	} = lessonData;

	const addLesson = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/videos`, {
				...lessonData,
				files: { avatar: files?.selected?._id },
				onModel: "Course",
			});
			router.push(`/noadmin/lessons`);
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
		setLessonData({
			resourceId: 0,
			title: `Untitled`,
			text: `No description`,
			featured: false,
			commented: false,
			embedding: false,
			category: undefined,
			password: ``,
			status: `draft`,
			video_url: ``,
			free_preview: false,
			language: "english",
			duration: 0,
		});
	};

	return (
		<form className="row" onSubmit={addLesson}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setLessonData({
							...lessonData,
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
					objectData={lessonData}
					setObjectData={setLessonData}
					onModel="video"
					advancedTextEditor={false}
				/>
				<label htmlFor="resourceId" className="form-label">
					Course
				</label>
				<select
					id="resourceId"
					name="resourceId"
					value={resourceId}
					onChange={(e) => {
						setLessonData({
							...lessonData,
							resourceId: e.target.value,
						});
					}}
					className="form-control"
				>
					{courses.map((course) => (
						<option key={course._id} value={course._id}>
							{course.title}
						</option>
					))}
				</select>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={files?.selected?._id}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					categories={categories}
					objectData={lessonData}
					setObjectData={setLessonData}
					multipleFiles={false}
					onModel={"Lesson"}
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

export default CreateLesson;
