"use client";
const FileTypes = ({ rows = [] }) => {
	return (
		<ul className="list-group list-group-flush small mt-3">
			<li className="list-group-item px-0 fw-semibold" aria-hidden="true">
				<div className="row g-0">
					<div className="col-6 pe-2">Type</div>
					<div className="col-3 pe-2 text-end">Files</div>
					<div className="col-3 text-end">Size</div>
				</div>
			</li>
			{rows.map((row) => (
				<li key={row.type} className="list-group-item px-0">
					<div className="row g-0">
						<div className="col-6 pe-2 text-truncate">
							<span className="visually-hidden">Type: </span>
							{row.type}
						</div>
						<div className="col-3 pe-2 text-end">
							<span className="visually-hidden">Files: </span>
							{row.count}
						</div>
						<div className="col-3 text-end">
							<span className="visually-hidden">Size: </span>
							{row.size}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default FileTypes;
