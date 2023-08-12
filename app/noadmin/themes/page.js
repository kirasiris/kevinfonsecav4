"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/blogs/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/layout/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/admin/admincardheadermenu";

const AdminThemesIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [themes, setThemes] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt&postType=theme`);

	const fetchThemes = async () => {
		try {
			const res = await axios.get(`/themes${params}`);
			setThemes(res?.data?.data);
			setTotalResults({ ...totalResults, themes: res?.data?.countAll });
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
		fetchThemes();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/themes/${id}`);
			toast.success("Theme deleted");
			fetchThemes();
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
			await axios.delete(`/themes/deleteall`);
			toast.success("Themes deleted");
			fetchThemes();
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
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink="/noadmin/themes"
					pageText="Themes"
					totalResults={totalResults.themes}
					addLink="/noadmin/themes/create"
					addLinkText="theme"
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{themes?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{themes?.map((theme) => (
							<Single
								key={theme._id}
								object={theme}
								handleDelete={handleDelete}
								themes={themes}
								setThemes={setThemes}
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

export default AdminThemesIndex;
