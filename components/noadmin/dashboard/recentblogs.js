"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const statusBadge = (status) =>
	status === "published" ? "text-bg-success" : "text-bg-secondary";

const RecentBlogs = ({ blogs = [] }) => {
	return (
		<ul className="list-group list-group-flush small">
			<li className="list-group-item px-0 fw-semibold" aria-hidden="true">
				<div className="row g-0 align-items-center">
					<div className="col-6 col-md-5 pe-2">Title</div>
					<div className="d-none d-md-block col-md-3 pe-2">Category</div>
					<div className="col-3 col-md-2 pe-2">Status</div>
					<div className="col-3 col-md-2 text-end">Created</div>
				</div>
			</li>
			{blogs.map((blog) => (
				<li key={blog.id} className="list-group-item px-0">
					<div className="row g-0 align-items-center">
						<div className="col-6 col-md-5 pe-2">
							<p className="fw-medium mb-0 text-truncate" title={blog.title}>
								{blog.title}
							</p>
							<p className="mb-0 text-truncate">by {blog.author}</p>
						</div>
						<div className="d-none d-md-block col-md-3 pe-2 text-truncate">
							<span className="visually-hidden">Category: </span>
							{blog.category}
						</div>
						<div className="col-3 col-md-2 pe-2">
							<span className="visually-hidden">Status: </span>
							<span
								className={`badge rounded-pill text-capitalize ${statusBadge(blog.status)} align-middle`}
							>
								{blog.status || "unknown"}
							</span>
						</div>
						<div className="col-3 col-md-2 text-end">
							<span className="visually-hidden">Created: </span>
							{formatDate(blog.createdAt)}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default RecentBlogs;
