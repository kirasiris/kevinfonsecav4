"use client";
const Panel = ({
	title = ``,
	subtitle = ``,
	colClasses = `col-lg-6`,
	cardClasses = ``,
	isEmpty = false,
	children,
}) => {
	return (
		<div className={`${colClasses} mb-3`}>
			<div className="card h-100">
				<div className="card-header">
					{title}
					{subtitle && <small className="d-block">{subtitle}</small>}
				</div>
				<div
					className={`card-body d-grid ${cardClasses}`}
					style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
				>
					{isEmpty ? (
						<p className="small text-center py-5 mb-0">
							No data available yet.
						</p>
					) : (
						<div>{children}</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Panel;
