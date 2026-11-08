"use client";
const InventoryWatch = ({ items = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{items.map((item) => (
				<li
					key={item.id}
					className="list-group-item d-flex justify-content-between align-items-start gap-3 px-0"
				>
					<div className="text-truncate">
						<span className="d-block text-truncate">{item.title}</span>
						<small className="text-body-secondary">
							{item.type}
							{item.price ? ` · ${item.price}` : ""}
						</small>
					</div>
					<div className="text-end text-nowrap">
						<span
							className={`badge ${item.low ? "text-bg-danger" : "text-bg-light"}`}
						>
							{item.stock} in stock
						</span>
						<small className="d-block text-body-secondary">
							alert at {item.threshold}
						</small>
					</div>
				</li>
			))}
		</ul>
	);
};

export default InventoryWatch;
