"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/logs/single";
import AuthContext from "@/helpers/globalContext";

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
			<div className="bg-body-secondary mb-3 p-1">
				<Link
					href={{
						pathname: "/noadmin/logs",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/logs/published",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Published</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/logs/draft",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/logs/scheduled",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Scheduled</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/logs/trashed",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Trashed</a>
				</Link>
			</div>
			<div className="card rounded-0">
				<div className="card-header">
					<Link
						href={{
							pathname: "/noadmin/logs",
							query: { page: 1, limit: 10 },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm float-start">
							Logs - ({totalResults.logs})
						</a>
					</Link>
					<div className="btn-group float-end">
						<button
							className="btn btn-danger btn-sm"
							type="button"
							onClick={handleDeleteAll}
						>
							Delete all
						</button>
					</div>
				</div>
				{logs?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{logs?.map((log) => (
							<Single
								key={log._id}
								object={log}
								handleDelete={handleDelete}
								logs={logs}
								setLogs={setLogs}
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
