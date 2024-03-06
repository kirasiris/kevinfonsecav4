"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/changelogs/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminChangelogsIndex = () => {
	const {
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);

	const router = useRouter();

	const [changelogs, setChangelogs] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchChangelogs = async () => {
		try {
			const res = await axios.get(`/changelogs${params}`);
			setChangelogs(res?.data?.data);
			setTotalPages(res?.data?.pagination?.totalpages);
			setCurrentResults(res?.data?.count);
			setTotalResults({ ...totalResults, changelogs: res?.data?.countAll });
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
		fetchChangelogs();
	}, [router, params]);

	useEffect(() => {
		setList(changelogs);
	}, [changelogs]);

	useEffect(() => {
		if (keyword !== "") {
			const result = changelogs.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(changelogs);
		}
	}, [keyword]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/changelogs/${id}/permanently`);
			toast.success("Changelog deleted");
			fetchChangelogs();
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
			await axios.delete(`/changelogs/deleteall`);
			toast.success("Changelogs deleted");
			fetchChangelogs();
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

	const groupByDate = changelogs?.reduce((groups, changelog) => {
		const date = changelog.createdAt.split("T")[0];
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(changelog);
		return groups;
	}, {});

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/changelogs"
				publishedLink="/noadmin/changelogs/published"
				draftLink="/noadmin/changelogs/draft"
				scheduledLink="/noadmin/changelogs/scheduled"
				trashedLink="/noadmin/changelogs/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/changelogs`}
					pageText="Changelogs"
					currentResults={currentResults}
					totalResults={totalResults.changelogs}
					addLink={`/noadmin/changelogs/create`}
					addLinkText={`changelog`}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{Object.entries(groupByDate)?.map(([date, list]) => (
								<div key={date}>
									<p className="text-center my-3">{date}</p>
									{list?.map((changelog) => (
										<Single
											key={changelog._id}
											object={changelog}
											handleDelete={handleDelete}
											objects={list}
											setObjects={setChangelogs}
											setTotalResults={setTotalResults}
										/>
									))}
								</div>
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
		</>
	);
};

export default AdminChangelogsIndex;
