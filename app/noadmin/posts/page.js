"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/posts/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminPostsIndex = () => {
	const { auth, totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [posts, setPosts] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt&postType=post`);

	const fetchPosts = async () => {
		try {
			const res = await axios.get(`/posts${params}`);
			setPosts(res?.data?.data);
			setTotalResults({ ...totalResults, posts: res?.data?.countAll });
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
		fetchPosts();
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/posts/${id}`);
			toast.success("Post deleted");
			fetchPosts();
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
			await axios.delete(`/posts/deleteall`);
			toast.success("Posts deleted");
			fetchPosts();
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
				allLink="/noadmin/posts"
				publishedLink="/noadmin/posts/published"
				draftLink="/noadmin/posts/draft"
				scheduledLink="/noadmin/posts/scheduled"
				trashedLink="/noadmin/posts/trashed"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/posts`}
					pageText="Posts"
					totalResults={totalResults.posts}
					addLink={`/noadmin/posts/create`}
					addLinkText={`post`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{posts?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{posts?.map((post) => (
							<Single
								key={post._id}
								object={post}
								handleDelete={handleDelete}
								objects={posts}
								setObjects={setPosts}
								setTotalResults={setTotalResults}
								auth={auth}
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

export default AdminPostsIndex;