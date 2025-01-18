"use client";

const Header = ({
	title = "",
	description = "",
	headerClasses = "py-5 mb-4",
	headerContainerClasses = "",
	headerStyle = {},
}) => {
	return (
		<header
			className={`bg-secondary border-bottom ${headerClasses}`}
			style={headerStyle}
		>
			<div className={`container ${headerContainerClasses}`}>
				<div className="row my-5">
					<div className="col-lg-12">
						<div className="text-white text-center">
							{title && <h1 className="fw-bolder display-1">{title}</h1>}
							{description && <p className="lead mb-0">{description}</p>}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
