"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/videos/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";

const AdminLessonsIndex = () => {
	const {
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);

	const router = useRouter();

	const [lessons, setLessons] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}&onModel=Playlist`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchLessons = async () => {
		try {
			const res = await axios.get(`/videos${params}`);
			setLessons(res?.data?.data);
			setTotalPages(res?.data?.pagination?.totalpages);
			setCurrentResults(res?.data?.count);
			setTotalResults({ ...totalResults, videos: res?.data?.countAll });
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
		fetchLessons();
	}, [router, params]);

	useEffect(() => {
		setList(lessons);
	}, [lessons]);

	useEffect(() => {
		if (keyword !== "") {
			const result = lessons.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(lessons);
		}
	}, [keyword]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/videos/${id}`);
			toast.success("Lesson deleted");
			fetchLessons();
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
			await axios.delete(`/videos/deleteall`);
			toast.success("Lessons deleted");
			fetchLessons();
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
				allLink="/noadmin/lessons"
				publishedLink="/noadmin/lessons/published"
				draftLink="/noadmin/lessons/draft"
				scheduledLink="/noadmin/lessons/scheduled"
				trashedLink="/noadmin/lessons/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/lessons`}
					pageText="Lessons"
					currentResults={currentResults}
					totalResults={totalResults.lessons}
					addLink={`/noadmin/lessons/create`}
					addLinkText={`lesson`}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{list?.map((lesson) => (
								<Single
									key={lesson._id}
									object={lesson}
									handleDelete={handleDelete}
									objects={list}
									setObjects={setLessons}
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
		</>
	);
};

export default AdminLessonsIndex;