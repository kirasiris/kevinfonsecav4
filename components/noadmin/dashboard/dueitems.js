"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const nextLabel = (item) => {
	if (item.error) return "Could not count";
	if (item.nextAt) return `Next on ${formatDate(item.nextAt)}`;
	return "Nothing upcoming";
};

const DueItems = ({ items = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{items.map((item) => (
				<li
					key={item.model}
					className="list-group-item d-flex justify-content-between align-items-start gap-3 px-0"
				>
					<div className="text-truncate">
						<span className="d-block text-truncate fw-medium">
							{item.model}
						</span>
						<small className="text-body-secondary" title={item.error || ""}>
							{nextLabel(item)}
						</small>
					</div>
					<div className="text-end text-nowrap">
						<span
							className={`badge ${item.due > 0 ? "text-bg-warning" : "text-bg-light"}`}
						>
							{item.error ? "—" : item.due.toLocaleString()} due
						</span>
						<small className="d-block text-body-secondary">
							{item.error ? "—" : item.upcoming.toLocaleString()} upcoming
						</small>
					</div>
				</li>
			))}
		</ul>
	);
};

export default DueItems;
