"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/layout/admin/adminsidebar";
import MyTextArea from "@/layout/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdateTheme = () => {
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
		fetchCategories(`?categoryType=theme`);
	}, []);

	const [themeData, setThemeData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		featured: true,
		embedding: true,
		category: undefined,
		commented: true,
		password: ``,
		status: `draft`,
		fullWidth: false,
		github_readme: `#`,
	});

	const {
		title,
		avatar,
		text,
		featured,
		embedding,
		category,
		commented,
		password,
		status,
		fullWidth,
		github_readme,
	} = themeData;

	const [theme, setTheme] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const themeId = id;

	useEffect(() => {
		const fetchTheme = async () => {
			try {
				const res = await axios.get(`/themes/${themeId}`);
				setTheme(res?.data?.data);
				setThemeData({
					title: res?.data?.data?.title,
					avatar: res?.data?.data?.files?.avatar,
					text: res?.data?.data?.text,
					featured: res?.data?.data?.featured,
					embedding: res?.data?.data?.embedding,
					category: res?.data?.data?.category,
					commented: res?.data?.data?.commented,
					// password: res?.data?.data?.password,
					status: res?.data?.data?.status,
					fullWidth: res?.data?.data?.fullWidth,
					github_readme: res?.data?.data?.github_readme,
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
		fetchTheme();
	}, [themeId]);

	const upgradeTheme = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/themes/${theme._id}`, {
				...themeData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			router.push(`/noadmin/themes`);
		} catch (err) {
			console.log(err);
			// const error = err.respgfonse.data.message;
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
		setThemeData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: ``,
			featured: false,
			embedding: false,
			category: undefined,
			commented: false,
			password: ``,
			tags: [],
			status: `draft`,
			fullWidth: false,
			github_readme: ``,
		});
	};

	return loading || theme === null || theme === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading... {console.log(error)}</>
		)
	) : (
		<form className="row" onSubmit={upgradeTheme}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setThemeData({
							...themeData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="blog-text multipurpose-textarea" className="form-label">
					Text
				</label>
				<MyTextArea
					id="blog-text"
					name="text"
					value={text}
					objectData={themeData}
					setObjectData={setThemeData}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					avatar={avatar}
					status={status}
					fullWidth={fullWidth}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={true}
					github_readme={github_readme}
					category={category}
					categories={categories}
					objectData={themeData}
					setObjectData={setThemeData}
					multipleFiles={true}
					onModel={"Blog"}
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

export default UpdateTheme;
