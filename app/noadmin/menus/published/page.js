"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/menus/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminMenusPublishedIndex = () => {
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

	const [menus, setMenus] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}&status=published`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchMenus = async () => {
		try {
			const res = await fetchurl(`/menus${params}`);
			setMenus(res?.data);
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, menus: res?.countAll });
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
		fetchMenus();
	}, [router, params]);

	useEffect(() => {
		setList(menus);
	}, [menus]);

	useEffect(() => {
		if (keyword !== "") {
			const result = menus.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(menus);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await fetchurl(`/menus/${id}/draftit`, "PUT", "no-cache");
			toast.success("Menu drafted");
			fetchMenus();
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
			await fetchurl(`/menus/${id}/publishit`, "PUT", "no-cache");
			toast.success("Menu published");
			fetchMenus();
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
			await fetchurl(`/menus/${id}/trashit`, "PUT", "no-cache");
			toast.success("Menu trashed");
			fetchMenus();
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
			await fetchurl(`/menus/${id}/scheduleit`, "PUT", "no-cache");
			toast.success("Menu scheduled");
			fetchMenus();
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
			await fetchurl(`/menus/${id}/permanently`, "DELETE", "no-cache");
			toast.success("Menu deleted");
			fetchMenus();
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
			await fetchurl(`/menus/deleteall`, "PUT", "no-cache");
			toast.success("Menus trashed");
			fetchMenus();
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
			await fetchurl(`/menus/deleteall/permanently`, "DELETE", "no-cache");
			toast.success("Menus deleted");
			fetchMenus();
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
				allLink="/noadmin/menus"
				publishedLink="/noadmin/menus/published"
				draftLink="/noadmin/menus/draft"
				scheduledLink="/noadmin/menus/scheduled"
				trashedLink="/noadmin/menus/trashed"
				categoriesLink="/noadmin/menus/categories"
				categoryType=""
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/menus`}
					pageText="Menus"
					currentResults={currentResults}
					totalResults={totalResults.menus}
					addLink={`/noadmin/menus/create`}
					addLinkText={`menu`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{list?.map((menu) => (
								<Single
									key={menu._id}
									object={menu}
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
									handleDelete={handleDelete}
									objects={list}
									setObjects={setMenus}
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
							postType=""
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

export default AdminMenusPublishedIndex;
