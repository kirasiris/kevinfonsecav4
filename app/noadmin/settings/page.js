"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/settings/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminSettingsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [settings, setSettings] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchSettings = async () => {
		try {
			const res = await axios.get(`/settings${params}`);
			setSettings(res?.data?.data);
			setTotalResults({ ...totalResults, settings: res?.data?.countAll });
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
		fetchSettings();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/settings/${id}`);
			toast.success("Setting deleted");
			fetchSettings();
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
			await axios.delete(`/settings/deleteall`);
			toast.success("Settings deleted");
			fetchSettings();
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
				allLink="/noadmin/settings"
				publishedLink="/noadmin/settings/published"
				draftLink="/noadmin/settings/draft"
				scheduledLink="/noadmin/settings/scheduled"
				trashedLink="/noadmin/settings/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/settings`}
					pageText="Settings"
					totalResults={totalResults.settings}
					addLink={`/noadmin/settings/create`}
					addLinkText={`setting`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{settings?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{settings?.map((setting) => (
							<Single
								key={setting._id}
								object={setting}
								handleDelete={handleDelete}
								objects={settings}
								setObjects={setSettings}
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

export default AdminSettingsIndex;
