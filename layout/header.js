import Image from "next/image";
import Link from "next/link";

const Header = ({
	title = "",
	description = "",
	headerClasses = "py-5 mb-4",
	headerContainerClasses = "",
	headerStyle = {},
}) => {
	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container">
					<Link href="/" passHref legacyBehavior>
						<a className="navbar-brand">
							<Image
								alt={`Kevin Uriel Fonseca`}
								src={`https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg`}
								width="30"
								height="24"
								className="d-inline-block align-text-top"
							/>
						</a>
					</Link>
					<button
						className="navbar-toggle"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggle-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link href="/" passHref legacyBehavior>
									<a className="nav-link" aria-current="page">
										Home
									</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href="/about" passHref legacyBehavior>
									<a className="nav-link" aria-current="page">
										About
									</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link
									href={{
										pathname: "/blog",
										query: { page: 1, limit: 10 },
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link" aria-current="page">
										Blog
									</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href="/theme" passHref legacyBehavior>
									<a className="nav-link" aria-current="page">
										Themes
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<header
				className={`bg-light border-bottom ${headerClasses}`}
				style={headerStyle}
			>
				<div className={`container ${headerContainerClasses}`}>
					<div className="text-center my-5">
						{title && <h1 className="fw-bolder">{title}</h1>}
						{description && <p className="lead mb-0">{description}</p>}
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
