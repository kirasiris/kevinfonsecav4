"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/reports/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminReportsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [reports, setReports] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchReports = async () => {
		try {
			const res = await axios.get(`/reports${params}`);
			setReports(res?.data?.data);
			setTotalResults({ ...totalResults, reports: res?.data?.countAll });
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
		fetchReports();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/reports/${id}`);
			toast.success("Report deleted");
			fetchReports();
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
			await axios.delete(`/reports/deleteall`);
			toast.success("Reports deleted");
			fetchReports();
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
				allLink="/noadmin/reports"
				publishedLink="/noadmin/reports/published"
				draftLink="/noadmin/reports/draft"
				scheduledLink="/noadmin/reports/scheduled"
				trashedLink="/noadmin/reports/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/reports`}
					pageText="Reports"
					totalResults={totalResults.reports}
					addLink={`/noadmin/reports/create`}
					addLinkText={`report`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{reports?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{reports?.map((report) => (
							<Single
								key={report._id}
								object={report}
								handleDelete={handleDelete}
								objects={reports}
								setObjects={setReports}
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

export default AdminReportsIndex;
