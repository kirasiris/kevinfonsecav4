"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/videos/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminVideosIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [videos, setVideos] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt&postType=video`);

	const fetchVideos = async () => {
		try {
			const res = await axios.get(`/videos${params}`);
			setVideos(res?.data?.data);
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
		fetchVideos();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/videos/${id}`);
			toast.success("Video deleted");
			fetchVideos();
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
			toast.success("Videos deleted");
			fetchVideos();
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
				allLink="/noadmin/videos"
				publishedLink="/noadmin/videos/published"
				draftLink="/noadmin/videos/draft"
				scheduledLink="/noadmin/videos/scheduled"
				trashedLink="/noadmin/videos/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/videos`}
					pageText="Videos"
					totalResults={totalResults.videos}
					addLink={`/noadmin/videos/create`}
					addLinkText={`video`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{videos?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{videos?.map((video) => (
							<Single
								key={video._id}
								object={video}
								handleDelete={handleDelete}
								objects={videos}
								setObjects={setVideos}
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

export default AdminVideosIndex;
