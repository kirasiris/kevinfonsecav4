"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const Menu = () => {
	return (
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
							<Link
								href={{
									pathname: "/profile",
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
						<li className="nav-item mx-1">
							<Link
								href={{
									pathname: "/quizz",
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
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Menu;
