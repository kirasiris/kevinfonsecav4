"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/categories/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import MyTextArea from "@/components/global/mytextarea";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminThemeCategoriesIndex = () => {
	const {
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);

	const router = useRouter();

	const [isTopLevel, setTopLevel] = useState(true);
	const [categories, setCategories] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(50);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}&categoryType=theme`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchCategories = async () => {
		try {
			const res = await axios.get(`/categories${params}`);
			setCategories(res?.data?.data);
			setTotalPages(res?.data?.pagination?.totalpages);
			setCurrentResults(res?.data?.count);
			setTotalResults({ ...totalResults, categories: res?.data?.countAll });
			setPage(res?.data?.pagination?.current);
			setLoading(false);
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
	}, [router, params]);

	const [categoryData, setCategoryData] = useState({
		title: `Untitled`,
		text: `No description`,
		parentCategory: undefined,
	});

	const { title, text, parentCategory } = categoryData;

	const createCategory = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`/categories`, {
				...categoryData,
				categoryType: "theme",
			});
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

	useEffect(() => {
		setList(categories);
	}, [categories]);

	useEffect(() => {
		if (keyword !== "") {
			const result = categories.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(categories);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await axios.put(`/categories/${id}/draftit`);
			toast.success("Category drafted");
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

	const publishIt = async (id) => {
		try {
			await axios.put(`/categories/${id}/publishit`);
			toast.success("Category published");
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

	const trashIt = async (id) => {
		try {
			await axios.put(`/categories/${id}/trashit`);
			toast.success("Category trashed");
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

	const scheduleIt = async (id) => {
		try {
			await axios.put(`/categories/${id}/scheduleit`);
			toast.success("Category scheduled");
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

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/categories/${id}/permanently`);
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

	const handleTrashAll = async () => {
		try {
			await axios.put(`/categories/deleteall`, {
				categoryType: "theme",
			});
			toast.success("Categories trashed");
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
			await axios.delete(`/categories/deleteall/permanently`, {
				categoryType: "theme",
			});
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
			<AdminStatusesMenu
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
				categoriesLink="/noadmin/themes/categories"
				categoryType="theme"
			/>
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
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
							id="text"
							name="text"
							value={text}
							objectData={categoryData}
							setObjectData={setCategoryData}
							onModel="Category"
							advancedTextEditor={false}
						/>

						<div className="form-check form-switch">
							<input
								className="form-check-input"
								type="checkbox"
								role="switch"
								id="isTopLevel"
								defaultChecked={isTopLevel}
								onClick={() => setTopLevel(!isTopLevel)}
							/>
							<label htmlFor="isTopLevel" className="form-check-label">
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
						<AdminCardHeaderMenu
							allLink={`/noadmin/themes/categories`}
							pageText="Theme Categories"
							currentResults={currentResults}
							totalResults={totalResults.categories}
							addLink={`/noadmin/themes/categories`}
							addLinkText={`categories`}
							handleTrashAllFunction={handleTrashAll}
							handleDeleteAllFunction={handleDeleteAll}
							keyword={keyword}
							setKeyword={setKeyword}
						/>
						{list?.length > 0 ? (
							<>
								<ul className="list-group list-group-flush">
									{list?.map((category) => (
										<Single
											key={category._id}
											linkTo={`/noadmin/categories/update/${category._id}`}
											object={category}
											handleDraft={draftIt}
											handlePublish={publishIt}
											handleTrash={trashIt}
											handleSchedule={scheduleIt}
											handleDelete={handleDelete}
											objects={list}
											setObjects={setCategories}
											setTotalResults={setTotalResults}
										/>
									))}
									<li className="list-group-item">
										{page} / {totalPages}
									</li>
								</ul>
								<ClientNumericPagination
									totalPages={totalPages || Math.ceil(list.length / limit)}
									page={page}
									limit={limit}
									sortby={sortby}
									siblings={1}
									setParams={setParams}
									router={router}
								/>
							</>
						) : (
							<div
								className={`alert alert-${
									loading ? "primary" : "danger"
								} rounded-0 m-0 border-0`}
							>
								{loading ? "Loading" : "Nothing found"}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminThemeCategoriesIndex;
