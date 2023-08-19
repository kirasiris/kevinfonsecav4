"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/blogs/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/layout/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/layout/admin/admincardheadermenu";

const AdminBlogsIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [blogs, setBlogs] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt&postType=blog`);

	const fetchBlogs = async () => {
		try {
			const res = await axios.get(`/blogs${params}`);
			setBlogs(res?.data?.data);
			setTotalResults({ ...totalResults, blogs: res?.data?.countAll });
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
		fetchBlogs();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/blogs/${id}`);
			toast.success("Blog deleted");
			fetchBlogs();
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
			await axios.delete(`/blogs/deleteall`);
			toast.success("Blogs deleted");
			fetchBlogs();
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
				allLink="/noadmin/blogs"
				publishedLink="/noadmin/blogs/published"
				draftLink="/noadmin/blogs/draft"
				scheduledLink="/noadmin/blogs/scheduled"
				trashedLink="/noadmin/blogs/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/blogs`}
					pageText="Blogs"
					totalResults={totalResults.blogs}
					addLink={`/noadmin/blogs/create`}
					addLinkText={`blog`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{blogs?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{blogs?.map((blog) => (
							<Single
								key={blog._id}
								object={blog}
								handleDelete={handleDelete}
								objects={blogs}
								setObjects={setBlogs}
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

export default AdminBlogsIndex;
