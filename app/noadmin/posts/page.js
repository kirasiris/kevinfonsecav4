"use client";
import axios from "axios";
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
			const res = await axios.get(`/posts${params}`);
			setPosts([...posts, ...res?.data?.data]);
			setCurrentResults(res?.data?.count);
			setTotalResults({ ...totalResults, posts: res?.data?.countAll });
			setNext(res?.data?.pagination?.next?.page);
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
			<div className="card rounded-0 border-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/posts`}
					pageText="Posts"
					currentResults={currentResults}
					totalResults={totalResults.posts}
					addLink={`/noadmin/posts/create`}
					addLinkText={`post`}
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
