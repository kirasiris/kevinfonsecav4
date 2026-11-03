"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const RecentActivity = ({ items = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{items.map((item) => (
				<li key={item.id} className="list-group-item px-0">
					<div className="d-flex justify-content-between align-items-start gap-2">
						<div className="text-truncate">
							<p className="small mb-0 text-truncate" title={item.text}>
								{item.text}
							</p>
							<p className="small mb-0 text-body-secondary text-truncate">
								<span className="badge text-bg-secondary me-1">
									{item.model}
								</span>
								{item.user}
							</p>
						</div>
						<span className="small text-nowrap">
							{formatDate(item.createdAt)}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
};

export default RecentActivity;
