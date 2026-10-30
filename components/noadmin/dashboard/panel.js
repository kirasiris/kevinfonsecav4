"use client";
const Panel = ({
	title = ``,
	subtitle = ``,
	colClasses = `col-lg-6`,
	isEmpty = false,
	children,
}) => {
	return (
		<div className={`${colClasses} mb-3`}>
			<div className="card h-100">
				<div className="card-header">
					{title}
					{subtitle && (
						<small className="d-block text-body-secondary">{subtitle}</small>
					)}
				</div>
				<div className="card-body">
					{isEmpty ? (
						<p className="text-body-secondary small text-center py-5 mb-0">
							No data available yet.
						</p>
					) : (
						children
					)}
				</div>
			</div>
		</div>
	);
};

export default Panel;
