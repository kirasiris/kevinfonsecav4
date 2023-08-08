"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Single from "@/components/admin/blogs/single";

const AdminBlogIndex = () => {
	const [blogs, setBlogs] = useState([]);
	const router = useRouter();
	const [params] = useState(`?page=1&limit=10&sort=-createdAt&postType=blog`);

	const fetchBlogs = async () => {
		try {
			// const res = await axios.get(`/blogs${params}`);
			const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`);
			const render = await res.json();
			setBlogs(render?.data);
			// setTotalResults({ ...totalResults, blogs: res?.data?.countAll });
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
			await fetch(`http://localhost:5000/api/v1/blogs/${id}`, {
				method: "DELETE",
			});
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
			// await axios.delete(`/blogs/deleteallblogs`);
			await fetch(`http://localhost:5000/api/v1/blogs/deleteallblogs`, {
				method: "DELETE",
			});
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
			<div className="bg-body-secondary mb-3 p-1">
				<Link
					href={{
						pathname: "/noadmin/blogs",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/published",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Published</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/draft",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/scheduled",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Scheduled</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/trashed",
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
							pathname: "/noadmin/blogs",
							query: { page: 1, limit: 10 },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm float-start">Blogs</a>
					</Link>
					<div className="btn-group float-end">
						<Link
							href={{
								pathname: "/noadmin/blogs/create",
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="btn btn-primary btn-sm">Add new blog</a>
						</Link>
						<button className="btn btn-danger btn-sm">Delete all</button>
					</div>
				</div>
				{blogs?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{blogs?.map((blog) => (
							<Single key={blog._id} object={blog} />
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

export default AdminBlogIndex;
