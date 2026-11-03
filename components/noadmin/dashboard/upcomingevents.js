"use client";
import { capitalize, formatDate } from "@/helpers/dashboard/dashboardstats";

const PRIORITY_BADGES = {
	urgent: "text-bg-danger",
	high: "text-bg-warning",
	medium: "text-bg-secondary",
	low: "text-bg-light",
};

const UpcomingEvents = ({ events = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{events.map((event) => (
				<li key={event.id} className="list-group-item px-0">
					<div className="d-flex justify-content-between align-items-start gap-2">
						<div className="text-truncate">
							<p className="fw-medium small mb-0 text-truncate" title={event.title}>
								{event.title}
							</p>
							<p className="small mb-0 text-body-secondary text-truncate">
								{event.type}
								{event.method && ` · ${capitalize(event.method.replace(/-/g, " "))}`}
							</p>
						</div>
						<div className="text-end">
							<span className="small text-nowrap d-block">
								{formatDate(event.date)}
								{event.time && ` · ${event.time}`}
							</span>
							{event.priority && (
								<span
									className={`badge ${PRIORITY_BADGES[event.priority] || "text-bg-secondary"}`}
								>
									{capitalize(event.priority)}
								</span>
							)}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default UpcomingEvents;
