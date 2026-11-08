"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const RecentRequests = ({ requests = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{requests.map((r) => (
				<li
					key={r.id}
					className="list-group-item d-flex justify-content-between align-items-start gap-3 px-0"
				>
					<div className="text-truncate">
						<span
							className={`d-block text-truncate ${r.unread ? "fw-bold" : ""}`}
						>
							{r.name}
						</span>
						<small className="text-body-secondary">{r.subject}</small>
					</div>
					<div className="text-end text-nowrap">
						<span
							className={`badge ${r.unread ? "text-bg-primary" : "text-bg-light"}`}
						>
							{r.unread ? "New" : "Read"}
						</span>
						<small className="d-block text-body-secondary">
							{r.createdAt ? formatDate(r.createdAt) : "—"}
						</small>
					</div>
				</li>
			))}
		</ul>
	);
};

export default RecentRequests;
