"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/changelogs/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/layout/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/admin/admincardheadermenu";

const AdminChangelogsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [changelogs, setChangelogs] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchChangelogs = async () => {
		try {
			const res = await axios.get(`/changelogs${params}`);
			setChangelogs(res?.data?.data);
			setTotalResults({ ...totalResults, changelogs: res?.data?.countAll });
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
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/changelogs/${id}`);
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
					totalResults={totalResults.changelogs}
					addLink={`/noadmin/changelogs/create`}
					addLinkText={`changelog`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{changelogs?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{changelogs?.map((changelog) => (
							<Single
								key={changelog._id}
								object={changelog}
								handleDelete={handleDelete}
								changelogs={changelogs}
								setChangelogs={setChangelogs}
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

export default AdminChangelogsIndex;
