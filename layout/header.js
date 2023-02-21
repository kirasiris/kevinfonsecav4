const Header = ({ title = "No title", description = "No description" }) => {
	return (
		<header className="py-5 bg-light border-bottom mb-4">
			<div className="container">
				<div className="text-center my-5">
					<h1 className="fw-bolder">{title}!</h1>
					<p className="lead mb-0">{description}</p>
				</div>
			</div>
		</header>
	);
};

export default Header;
