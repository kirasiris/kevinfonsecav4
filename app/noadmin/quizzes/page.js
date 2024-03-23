"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/quizzes/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminQuizzesIndex = () => {
	const {
		auth,
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [quizzes, setQuizzes] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchQuizzes = async () => {
		try {
			const res = await fetchurl(`/quizzes${params}`, "GET", "no-cache");
			setQuizzes(res?.data);
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, quizzes: res?.countAll });
			setPage(res?.pagination?.current);
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
		fetchQuizzes();
	}, [router, params]);

	useEffect(() => {
		setList(quizzes);
	}, [quizzes]);

	useEffect(() => {
		if (keyword !== "") {
			const result = quizzes.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(quizzes);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await fetchurl(`/quizzes/${id}/draftit`, "PUT", "no-cache");
			toast.success("Quiz drafted");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/${id}/publishit`, "PUT", "no-cache");
			toast.success("Quiz published");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/${id}/trashit`, "PUT", "no-cache");
			toast.success("Quiz trashed");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/${id}/scheduleit`, "PUT", "no-cache");
			toast.success("Quiz scheduled");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/${id}/permanently`, "DELETE", "no-cache");
			toast.success("Quiz deleted");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/deleteall`, "PUT", "no-cache");
			toast.success("Quizzes trashed");
			fetchQuizzes();
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
			await fetchurl(`/quizzes/deleteall/permanently`, "DELETE", "no-cache");
			toast.success("Quizzes deleted");
			fetchQuizzes();
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

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/quizzes"
				publishedLink="/noadmin/quizzes/published"
				draftLink="/noadmin/quizzes/draft"
				scheduledLink="/noadmin/quizzes/scheduled"
				trashedLink="/noadmin/quizzes/trashed"
				categoriesLink="/noadmin/quizzes/categories"
				categoryType="quizz"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/quizzes`}
					pageText="Quizzes"
					currentResults={currentResults}
					totalResults={totalResults.quizzes}
					addLink={`/noadmin/quizzes/create`}
					addLinkText={`quizz`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{list?.map((quizz) => (
								<Single
									key={quizz._id}
									object={quizz}
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
									handleDelete={handleDelete}
									objects={list}
									setObjects={setQuizzes}
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
							postType="quizz"
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
		</>
	);
};

export default AdminQuizzesIndex;
