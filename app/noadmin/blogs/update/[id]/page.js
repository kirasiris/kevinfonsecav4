"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/layout/admin/adminsidebar";
import MyTextArea from "@/layout/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdateBlog = () => {
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
		fetchCategories(`?categoryType=blog`);
	}, []);

	const [blogData, setBlogData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		featured: false,
		embedding: false,
		category: undefined,
		commented: false,
		password: ``,
		status: `draft`,
		fullWidth: false,
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
	} = blogData;

	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const blogId = id;

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const res = await axios.get(`/blogs/${blogId}`);
				setBlog(res?.data?.data);
				setBlogData({
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
		fetchBlog();
	}, [blogId]);

	const updateBlog = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/blogs/${blog._id}`, {
				...blogData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			router.push(`/noadmin/blogs`);
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
		setBlogData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: `No description`,
			featured: false,
			embedding: false,
			category: undefined,
			commented: false,
			password: ``,
			tags: [],
			status: `draft`,
			fullWidth: false,
		});
	};

	return loading || blog === null || blog === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={updateBlog}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setBlogData({
							...blogData,
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
					objectData={blogData}
					setObjectData={setBlogData}
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
					github={false}
					category={category._id ? category._id : category}
					categories={categories}
					objectData={blogData}
					setObjectData={setBlogData}
					multipleFiles={false}
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

export default UpdateBlog;
