"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/layout/admin/adminsidebar";
import MyTextArea from "@/layout/mytextarea";
import axios from "axios";

const CreateTheme = () => {
	// const {files} = useContext(GlobalContext)
	const router = useRouter();

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (params = "") => {
		try {
			// const res = await axios.get(`/categories${params}`);
			const res = await fetch(
				`http://localhost:5000/api/v1/categories${params}`
			);
			const render = await res.json();
			setCategories(render?.data);
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
		fetchCategories(`?categoryType=blog`);
	}, []);

	const [themeData, setThemeData] = useState({
		title: `Untitled`,
		// avatar: files?.selected?._id,
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

	const addTheme = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/blogs`, { ...themeData, postType: "theme" });
			toast.success(`Item created`);
			resetForm();
			router.push(`/admin/themes`);
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
		setThemeData({
			title: `Untitled`,
			// avatar: files?.selected?._id,
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

	return (
		<form className="row" onSubmit={addTheme}>
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
					handleChangeValue={(e) =>
						setThemeData({
							...themeData,
							text: e.target.value,
						})
					}
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
					onModel={"Theme"}
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

export default CreateTheme;
