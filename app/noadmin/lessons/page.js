"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/videos/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminLessonsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [lessons, setLessons] = useState([]);

	const [params] = useState(
		`?page=1&limit=10&sort=-createdAt&onModel=Playlist`
	);

	const fetchLessons = async () => {
		try {
			const res = await axios.get(`/videos${params}`);
			setLessons(res?.data?.data);
			setTotalResults({ ...totalResults, videos: res?.data?.countAll });
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
	}, [router]);

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
					totalResults={totalResults.lessons}
					addLink={`/noadmin/lessons/create`}
					addLinkText={`lesson`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{lessons?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{lessons?.map((video) => (
							<Single
								key={video._id}
								object={video}
								handleDelete={handleDelete}
								objects={lessons}
								setObjects={setLessons}
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
		</>
	);
};

export default AdminLessonsIndex;
