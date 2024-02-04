"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { deleteAuthTokenOnServer } from "@/helpers/setTokenOnServer";

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
					<Navbar.Toggle
						aria-controls="responsive-navbar-nav"
						className="me-1"
					/>
					<Link href={canonical} passHref legacyBehavior>
						<a
							className="navbar-brand"
							target="_blank"
							style={{ verticalAlign: "middle" }}
						>
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
					<Nav as="ul">
						{auth?.data?.isOnline ? (
							<>
								<li className="nav-item">
									<Link
										href={{
											pathname: `/profile/${auth?.data?._id}/${auth?.data?.username}`,
											query: {},
										}}
										passHref
										legacyBehavior
									>
										<a className="nav-link" aria-current="page">
											{auth.data.username}
										</a>
									</Link>
								</li>
								<li className="nav-item">
									<button
										className="btn btn-link"
										onClick={() => deleteAuthTokenOnServer("xAuthToken")}
									>
										Log Out
									</button>
								</li>
							</>
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
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Menu;
