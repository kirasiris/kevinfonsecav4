"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/categories/single";
import MyTextArea from "@/layout/mytextarea";
import { useContext } from "react";
import AuthContext from "@/helpers/globalContext";

const AdminCategoriesIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [categories, setCategories] = useState([]);
	const [isTopLevel, setTopLevel] = useState(true);

	const [params] = useState(`?page=1&sort=-createdAt`);

	const fetchCategories = async () => {
		try {
			const res = await axios.get(`/categories${params}`);
			setCategories(res?.data?.data);
			setTotalResults({ ...totalResults, blogs: res?.data?.countAll });
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
		fetchCategories();
	}, [router]);

	const [categoryData, setCategoryData] = useState({
		title: `Untitled`,
		text: `No description`,
		parentCategory: undefined,
	});

	const { title, text, parentCategory } = categoryData;

	const createCategory = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`/categories`, categoryData);
			setCategories([res?.data?.data, ...categories]);
			setTotalResults({ ...totalResults, categories: categories.length + 1 });
			toast.success(`Item created`);
			resetForm();
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/categories/${id}`);
			toast.success("Category deleted");
			fetchCategories();
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

	const handleDeleteAll = async () => {
		try {
			await axios.delete(`/categories/deleteall`);
			toast.success("Categories deleted");
			fetchCategories();
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

	const resetForm = () => {
		setCategoryData({
			title: `Untitled`,
			text: `No description`,
			parentCategory: undefined,
		});
		setTopLevel(true);
	};

	return (
		<>
			<div className="bg-body-secondary mb-3 p-1">
				<Link
					href={{
						pathname: "/noadmin/categories",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/categories/published",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Published</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/categories/draft",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/categories/scheduled",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Scheduled</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/categories/trashed",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Trashed</a>
				</Link>
			</div>
			<div className="row">
				<div className="col">
					<form onSubmit={createCategory}>
						<label htmlFor="category-title" className="form-label">
							Title
						</label>
						<input
							id="category-title"
							name="title"
							value={title}
							onChange={(e) => {
								setCategoryData({
									...categoryData,
									title: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label
							htmlFor="blog-text multipurpose-textarea"
							className="form-label"
						>
							Text
						</label>
						<MyTextArea
							id="category-text"
							name="text"
							value={text}
							handleChangeValue={(e) =>
								setCategoryData({
									...categoryData,
									text: e.target.value,
								})
							}
						/>
						<div className="form-check form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								role="switch"
								id="isTopLevel"
								checked={isTopLevel}
								onClick={() => setTopLevel(!isTopLevel)}
							/>
							<label className="form-check-label" for="isTopLevel">
								{isTopLevel ? "Is Top Level" : "Is Not Top Level"}
							</label>
						</div>
						{!isTopLevel && (
							<>
								<label htmlFor="parent" className="form-label">
									Parent
								</label>
								<select
									id="parent"
									name="parent"
									value={parentCategory}
									onChange={(e) => {
										setCategoryData({
											...categoryData,
											parentCategory: e.target.value,
										});
									}}
									className="form-control"
								>
									{categories?.map((item) => (
										<option key={item._id} value={item._id}>
											{item.title}
										</option>
									))}
								</select>
							</>
						)}
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
					</form>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<div className="card-header">
							<Link
								href={{
									pathname: "/noadmin/categories",
									query: { page: 1, limit: 10 },
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm float-start">
									Categories - ({totalResults.categories})
								</a>
							</Link>
							<div className="btn-group float-end">
								<button
									className="btn btn-danger btn-sm"
									type="button"
									onClick={handleDeleteAll}
								>
									Delete all
								</button>
							</div>
						</div>
						{categories?.length > 0 ? (
							<ul className="list-group list-group-flush">
								{categories?.map((category) => (
									<Single
										key={category._id}
										linkTo={`/noadmin/categories/update/${category._id}`}
										object={category}
										handleDelete={handleDelete}
										categories={categories}
										setCategories={setCategories}
										// totalResults={totalResults}
										setTotalResults={setTotalResults}
									/>
								))}
							</ul>
						) : (
							<div className="alert alert-danger rounded-0 m-0 border-0">
								Nothing found
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminCategoriesIndex;
