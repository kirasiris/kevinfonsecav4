"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const Menu = ({
	auth = {},
	title = "",
	logo = "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg",
	canonical = "",
}) => {
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container>
				<div className="navbar-header">
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Link href={canonical} passHref legacyBehavior>
						<a className="navbar-brand" target="_blank">
							<Image
								alt={title}
								src={logo}
								width="150"
								height="40"
								className="d-inline-block align-text-top"
							/>
						</a>
					</Link>
				</div>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav as="ul" className="me-auto">
						<li className="nav-item mx-1">
							<Link href={canonical} passHref legacyBehavior>
								<a className="nav-link" aria-current="page">
									Home
								</a>
							</Link>
						</li>
						<li className="nav-item mx-1">
							<Link
								href={{
									pathname: `${canonical}/profile`,
									query: { page: 1, limit: 10 },
								}}
								passHref
								legacyBehavior
							>
								<a className="nav-link" aria-current="page">
									Me
								</a>
							</Link>
						</li>
						<li className="nav-item mx-1">
							<Link
								href={{
									pathname: `${canonical}/blog`,
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
									pathname: `${canonical}/theme`,
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
						<li className="nav-item mx-1">
							<Link
								href={{
									pathname: `${canonical}/quizz`,
									query: { page: 1, limit: 10 },
								}}
								passHref
								legacyBehavior
							>
								<a className="nav-link" aria-current="page">
									Quizzes
								</a>
							</Link>
						</li>
					</Nav>
					{auth.data.isOnline ? (
						<button type="button" className="btn btn-light">
							Logout {auth.data.username}
						</button>
					) : (
						<Link
							href={{
								pathname: `auth/login`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="nav-link">Log In</a>
						</Link>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Menu;
