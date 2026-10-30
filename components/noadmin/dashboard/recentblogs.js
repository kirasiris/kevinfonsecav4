"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const statusBadge = (status) =>
	status === "published" ? "text-bg-success" : "text-bg-secondary";

const RecentBlogs = ({ blogs = [] }) => {
	return (
		<div className="table-responsive">
			<table className="table table-hover align-middle small mb-0">
				<thead>
					<tr>
						<th scope="col">Title</th>
						<th scope="col" className="d-none d-md-table-cell">
							Category
						</th>
						<th scope="col">Status</th>
						<th scope="col" className="text-end text-nowrap">
							Created
						</th>
					</tr>
				</thead>
				<tbody>
					{blogs.map((blog) => (
						<tr key={blog.id}>
							<td>
								<span
									className="d-block fw-medium text-truncate"
									style={{ maxWidth: 360 }}
									title={blog.title}
								>
									{blog.title}
								</span>
								<span className="text-body-secondary">by {blog.author}</span>
							</td>
							<td className="d-none d-md-table-cell text-body-secondary">
								{blog.category}
							</td>
							<td>
								<span
									className={`badge rounded-pill text-capitalize ${statusBadge(blog.status)}`}
								>
									{blog.status || "unknown"}
								</span>
							</td>
							<td className="text-end text-nowrap text-body-secondary">
								{formatDate(blog.createdAt)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RecentBlogs;
