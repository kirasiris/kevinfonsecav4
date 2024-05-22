"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/realstates/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminRealStatesTrashedIndex = () => {
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

	const [realstates, setRealStates] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}&status=trash`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchRealStates = async () => {
		try {
			const res = await fetchurl(`/realstates${params}`);
			setRealStates(res?.data);
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, realstates: res?.countAll });
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
		fetchRealStates();
	}, [router, params]);

	useEffect(() => {
		setList(realstates);
	}, [realstates]);

	useEffect(() => {
		if (keyword !== "") {
			const result = realstates.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(realstates);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await fetchurl(`/realstates/${id}/draftit`, "PUT", "no-cache");
			toast.success("Real State drafted");
			fetchRealStates();
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
			await fetchurl(`/realstates/${id}/publishit`, "PUT", "no-cache");
			toast.success("Real State published");
			fetchRealStates();
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
			await fetchurl(`/realstates/${id}/trashit`, "PUT", "no-cache");
			toast.success("Real State trashed");
			fetchRealStates();
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
			await fetchurl(`/realstates/${id}/scheduleit`, "PUT", "no-cache");
			toast.success("Real State scheduled");
			fetchRealStates();
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
			await fetchurl(`/realstates/${id}/permanently`, "DELETE", "no-cache");
			toast.success("Real State deleted");
			fetchRealStates();
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
			await fetchurl(`/realstates/deleteall`, "PUT", "no-cache");
			toast.success("Real States trashed");
			fetchRealStates();
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
			await fetchurl(`/realstates/deleteall/permanently`, "DELETE", "no-cache");
			toast.success("Real States deleted");
			fetchRealStates();
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
				allLink="/noadmin/realstates"
				publishedLink="/noadmin/realstates/published"
				draftLink="/noadmin/realstates/draft"
				scheduledLink="/noadmin/realstates/scheduled"
				trashedLink="/noadmin/realstates/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/realstates`}
					pageText="Real States"
					currentResults={currentResults}
					totalResults={totalResults.realstates}
					addLink={`/noadmin/realstates/create`}
					addLinkText={`real state`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{list?.map((realstate) => (
								<Single
									key={realstate._id}
									object={realstate}
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
									handleDelete={handleDelete}
									objects={list}
									setObjects={setRealStates}
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

export default AdminRealStatesTrashedIndex;
