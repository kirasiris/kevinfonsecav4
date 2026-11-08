"use client";
import { formatDate } from "@/helpers/dashboard/dashboardstats";

const RecentTransfers = ({ transfers = [] }) => {
	return (
		<div className="table-responsive">
			<table className="table table-sm align-middle mb-0">
				<caption className="visually-hidden">
					Latest acquisitions and dispositions
				</caption>
				<thead>
					<tr>
						<th scope="col">Received</th>
						<th scope="col">Firearm</th>
						<th scope="col">Status</th>
						<th scope="col" className="text-end">
							Fee
						</th>
					</tr>
				</thead>
				<tbody>
					{transfers.map((t) => (
						<tr key={t.id}>
							<td className="text-nowrap small">
								{t.receivedAt ? formatDate(t.receivedAt) : "—"}
							</td>
							<td>
								<span className="d-block">{t.firearm || "Unnamed"}</span>
								<small className="text-body-secondary">{t.detail}</small>
							</td>
							<td>
								<span
									className={`badge ${t.onHand ? "text-bg-primary" : "text-bg-secondary"}`}
								>
									{t.onHand ? "On hand" : "Disposed"}
								</span>
							</td>
							<td className="text-end small">{t.fee || "—"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default RecentTransfers;
