"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const Header = ({
	title = "",
	description = "",
	headerClasses = "py-5 mb-4",
	headerContainerClasses = "",
	headerStyle = {},
}) => {
	return (
		<>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Container>
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
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav as="ul">
							<li className="nav-item mx-1">
								<Link href="/" passHref legacyBehavior>
									<a className="nav-link" aria-current="page">
										Home
									</a>
								</Link>
							</li>
							<li className="nav-item mx-1">
								<Link href="/about" className="nav-link">
									About
								</Link>
							</li>
							<li className="nav-item mx-1">
								<Link
									href={{
										pathname: "/post",
										query: { page: 1, limit: 10 },
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link" aria-current="page">
										Posts
									</a>
								</Link>
							</li>
							<li className="nav-item mx-1">
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
							<li className="nav-item mx-1">
								<Link
									href={{
										pathname: "/theme",
										query: { page: 1, limit: 10 },
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link" aria-current="page">
										Themes
									</a>
								</Link>
							</li>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<header
				className={`bg-light border-bottom ${headerClasses}`}
				style={headerStyle}
			>
				<div className={`container ${headerContainerClasses}`}>
					<div className="text-center my-5">
						{title && <h1 className="fw-bolder display-1">{title}</h1>}
						{description && <p className="lead mb-0">{description}</p>}
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
