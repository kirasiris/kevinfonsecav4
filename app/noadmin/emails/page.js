"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/emails/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminEmailsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [emails, setEmails] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchEmails = async () => {
		try {
			const res = await axios.get(`/emails${params}`);
			setEmails(res?.data?.data);
			setTotalResults({ ...totalResults, emails: res?.data?.countAll });
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
		fetchEmails();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/emails/${id}`);
			toast.success("Email deleted");
			fetchEmails();
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
			await axios.delete(`/emails/deleteall`);
			toast.success("Emails deleted");
			fetchEmails();
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
				allLink="/noadmin/emails"
				publishedLink="/noadmin/emails/published"
				draftLink="/noadmin/emails/draft"
				scheduledLink="/noadmin/emails/scheduled"
				trashedLink="/noadmin/emails/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/emails`}
					pageText="Emails"
					totalResults={totalResults.emails}
					addLink={`/noadmin/emails/create`}
					addLinkText={`email`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{emails?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{emails?.map((email) => (
							<Single
								key={email._id}
								object={email}
								handleDelete={handleDelete}
								objects={emails}
								setObjects={setEmails}
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

export default AdminEmailsIndex;
