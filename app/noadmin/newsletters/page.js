"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/newsletters/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/layout/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/admin/admincardheadermenu";

const AdminNewslettersIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [newsletters, setNewsletters] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchNewsletters = async () => {
		try {
			const res = await axios.get(`/newsletters${params}`);
			setNewsletters(res?.data?.data);
			setTotalResults({ ...totalResults, newsletters: res?.data?.countAll });
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
		fetchNewsletters();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/newsletters/${id}`);
			toast.success("Newsletter deleted");
			fetchNewsletters();
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
			await axios.delete(`/newsletters/deleteall`);
			toast.success("Newsletters deleted");
			fetchNewsletters();
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
				allLink="/noadmin/newsletters"
				publishedLink="/noadmin/newsletters/published"
				draftLink="/noadmin/newsletters/draft"
				scheduledLink="/noadmin/newsletters/scheduled"
				trashedLink="/noadmin/newsletters/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/newsletters`}
					pageText="Newsletters subscribers"
					totalResults={totalResults.newsletters}
					addLink={`/noadmin/newsletters/create`}
					addLinkText={`newsletter subscriber`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{newsletters?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{newsletters?.map((blog) => (
							<Single
								key={blog._id}
								object={blog}
								handleDelete={handleDelete}
								newsletters={newsletters}
								setNewsletters={setNewsletters}
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

export default AdminNewslettersIndex;
