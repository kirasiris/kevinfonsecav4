"use client";
const RankedList = ({
	items = [],
	singular = "item",
	plural = "items",
	barClass = "bg-success",
}) => {
	const max = Math.max(...items.map((i) => i.count), 1);

	return (
		<ol className="list-unstyled d-flex flex-column gap-3 mb-0">
			{items.map((item) => (
				<li key={item.id}>
					<div className="d-flex justify-content-between gap-2 small mb-1">
						<span className="text-truncate fw-medium" title={item.title}>
							{item.title}
						</span>
						<span className="text-body-secondary text-nowrap">
							{item.count.toLocaleString()} {item.count === 1 ? singular : plural}
						</span>
					</div>
					<div
						className="progress"
						style={{ height: 6 }}
						role="progressbar"
						aria-label={`${item.title}: ${item.count} ${plural}`}
						aria-valuenow={item.count}
						aria-valuemin={0}
						aria-valuemax={max}
					>
						<div
							className={`progress-bar ${barClass}`}
							style={{ width: `${(item.count / max) * 100}%` }}
						/>
					</div>
				</li>
			))}
		</ol>
	);
};

export default RankedList;
