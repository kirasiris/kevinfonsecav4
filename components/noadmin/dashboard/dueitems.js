"use client";

const DueItems = ({ items = [] }) => {
	return (
		<ul className="list-group list-group-flush">
			{items.map((item, index) => (
				<li key={index} className="list-group-item px-0">
					<div className="d-flex justify-content-between align-items-start gap-2">
						<div className="text-truncate">
							<p className="small mb-0 text-truncate" title={item}>
								{item}
							</p>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default DueItems;
