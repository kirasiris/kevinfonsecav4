"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const UpdateBlog = () => {
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
		fetchCategories(`?categoryType=blog`);
	}, []);

	const [blogData, setBlogData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		featured: true,
		embedding: true,
		category: undefined,
		commented: true,
		password: ``,
		status: `draft`,
		fullWidth: true,
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
				const res = await fetchurl(`/blogs/${blogId}`, "GET", "no-cache");
				setBlog(res?.data);
				setBlogData({
					title: res?.data?.title,
					avatar: res?.data?.files?.avatar,
					text: res?.data?.text,
					featured: res?.data?.featured,
					embedding: res?.data?.embedding,
					category: res?.data?.category,
					commented: res?.data?.commented,
					// password: res?.data?.password,
					status: res?.data?.status,
					fullWidth: res?.data?.fullWidth,
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

	const upgradeBlog = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/blogs/${blog._id}`, "PUT", "no-cache", {
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
			featured: true,
			embedding: true,
			category: undefined,
			commented: true,
			password: ``,
			tags: [],
			status: `draft`,
			fullWidth: true,
		});
	};

	return loading || blog === null || blog === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradeBlog}>
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
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={blogData}
					setObjectData={setBlogData}
					onModel="Blog"
					advancedTextEditor={true}
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
