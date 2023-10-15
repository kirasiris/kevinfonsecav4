"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/playlists/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminPlaylistsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [playlists, setPlaylists] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchPlaylists = async () => {
		try {
			const res = await axios.get(`/playlists${params}`);
			setPlaylists(res?.data?.data);
			setTotalResults({ ...totalResults, playlists: res?.data?.countAll });
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
		fetchPlaylists();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/playlists/${id}`);
			toast.success("Playlist deleted");
			fetchPlaylists();
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
			await axios.delete(`/playlists/deleteall`);
			toast.success("Playlists deleted");
			fetchPlaylists();
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
				allLink="/noadmin/playlists"
				publishedLink="/noadmin/playlists/published"
				draftLink="/noadmin/playlists/draft"
				scheduledLink="/noadmin/playlists/scheduled"
				trashedLink="/noadmin/playlists/trashed"
				categoriesLink="/noadmin/playlists/categories"
				categoryType="playlist"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/playlists`}
					pageText="Playlists"
					totalResults={totalResults.playlists}
					addLink={`/noadmin/playlists/create`}
					addLinkText={`playlist`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{playlists?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{playlists?.map((playlist) => (
							<Single
								key={playlist._id}
								object={playlist}
								handleDelete={handleDelete}
								objects={playlists}
								setObjects={setPlaylists}
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

export default AdminPlaylistsIndex;
