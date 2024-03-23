"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/posts/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";
import ClientLoadMorePagination from "@/layout/clientloadmorepagination";

const AdminPostsIndex = () => {
	const {
		auth,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [posts, setPosts] = useState([]);
	const [limit] = useState(10);
	const [next, setNext] = useState(0);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=1&limit=${limit}&sort=${sortby}&postType=post`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchPosts = async () => {
		try {
			const res = await fetchurl(`/posts${params}`, "GET", "no-cache");
			setPosts([...posts, ...res?.data]);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, posts: res?.countAll });
			setNext(res?.pagination?.next?.page);
			setLoading(false);
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
	}, [router, params]);

	useEffect(() => {
		setList(posts);
	}, [posts]);

	useEffect(() => {
		if (keyword !== "") {
			const result = posts.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(posts);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await fetchurl(`/posts/${id}/draftit`, "PUT", "no-cache");
			toast.success("Post drafted");
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

	const publishIt = async (id) => {
		try {
			await fetchurl(`/posts/${id}/publishit`, "PUT", "no-cache");
			toast.success("Post published");
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

	const trashIt = async (id) => {
		try {
			await fetchurl(`/posts/${id}/trashit`, "PUT", "no-cache");
			toast.success("Post trashed");
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

	const scheduleIt = async (id) => {
		try {
			await fetchurl(`/posts/${id}/scheduleit`, "PUT", "no-cache");
			toast.success("Post scheduled");
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

	const handleDelete = async (id) => {
		try {
			await fetchurl(`/posts/${id}/permanently`, "DELETE", "no-cache");
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

	const handleTrashAll = async () => {
		try {
			await fetchurl(`/posts/deleteall`, "PUT", "no-cache");
			toast.success("Posts trashed");
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
			await fetchurl(`/posts/deleteall/permanently`, "DELETE", "no-cache");
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
			<div className="card rounded-0 border-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/posts`}
					pageText="Posts"
					currentResults={currentResults}
					totalResults={totalResults.posts}
					addLink={`/noadmin/posts/create`}
					addLinkText={`post`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
					classList="border rounded-0"
				/>
				{list?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{list?.map((post) => (
								<Single
									key={post._id}
									object={post}
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
									handleDelete={handleDelete}
									objects={list}
									setObjects={setPosts}
									setTotalResults={setTotalResults}
									auth={auth}
								/>
							))}
						</ul>
						{posts.length > 0 &&
							posts.length >= limit &&
							next !== undefined &&
							next !== 0 && (
								<ClientLoadMorePagination
									limit={limit}
									next={next}
									sortby={sortby}
									setParams={setParams}
									postType="post"
									router={router}
									classList="border rounded-bottom"
								/>
							)}
					</>
				) : (
					<div
						className={`alert alert-${
							loading ? "primary" : "danger"
						} rounded-0 m-0 border-0`}
					>
						{loading ? "Loading" : "Nothing found"}
					</div>
				)}
			</div>
		</>
	);
};

export default AdminPostsIndex;
