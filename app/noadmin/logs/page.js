"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/logs/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/layout/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/admin/admincardheadermenu";

const AdminLogsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [logs, setLogs] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchLogs = async () => {
		try {
			const res = await axios.get(`/logs${params}`);
			setLogs(res?.data?.data);
			setTotalResults({ ...totalResults, logs: res?.data?.countAll });
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
		fetchLogs();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/logs/${id}`);
			toast.success("Log deleted");
			fetchLogs();
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
			await axios.delete(`/logs/deleteall`);
			toast.success("Logs deleted");
			fetchLogs();
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
				allLink="/noadmin/logs"
				publishedLink="/noadmin/logs/published"
				draftLink="/noadmin/logs/draft"
				scheduledLink="/noadmin/logs/scheduled"
				trashedLink="/noadmin/logs/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/logs`}
					pageText="Logs"
					totalResults={totalResults.logs}
					addLink={`/noadmin/logs/create`}
					addLinkText={`log`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{logs?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{logs?.map((log) => (
							<Single
								key={log._id}
								object={log}
								handleDelete={handleDelete}
								objects={logs}
								setObjects={setLogs}
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

export default AdminLogsIndex;
