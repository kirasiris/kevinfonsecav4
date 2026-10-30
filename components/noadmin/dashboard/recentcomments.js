"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const RecentComments = ({ comments = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{comments.map((comment) => (
				<li key={comment.id} className="list-group-item px-0">
					<div className="d-flex justify-content-between align-items-start gap-2">
						<div className="text-truncate">
							<p className="fw-medium small mb-0 text-truncate">
								{comment.name}
								{comment.title && (
									<span className="text-body-secondary fw-normal">{` · ${comment.title}`}</span>
								)}
							</p>
							<p
								className="small text-body-secondary mb-0 text-truncate"
								title={comment.target}
							>
								on {comment.target}
							</p>
						</div>
						<span className="small text-body-secondary text-nowrap">
							{formatDate(comment.createdAt)}
						</span>
					</div>
				</li>
			))}
		</ul>
	);
};

export default RecentComments;
