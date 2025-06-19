"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { deleteAuthTokenOnServer } from "@/helpers/setTokenOnServer";

const Menu = ({
	auth = {},
	title = "",
	logo = "https://www.fullstackpython.com/img/logos/bootstrap.png",
	canonical = "/",
	menus = [],
}) => {
	const pathname = usePathname();
	const isActive = (path = "") => {
		return pathname === path ? "active" : "";
	};
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Container>
				<div className="navbar-header">
					<Navbar.Toggle
						aria-controls="responsive-navbar-nav"
						className="me-1"
					/>
					<Link
						href={canonical}
						className={`navbar-brand`}
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
					</Link>
				</div>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav as="ul" className="me-auto">
						<li className="nav-item mx-1">
							<Link
								href={canonical}
								className={`nav-link ${isActive(canonical)}`}
								aria-current="page"
							>
								Home
							</Link>
						</li>
						<li className="nav-item mx-1">
							<Link
								href={{
									pathname: `${canonical}/quiz`,
									query: {
										page: 1,
										limit: 10,
										sort: `-createdAt`,
									},
								}}
								className={`nav-link ${isActive(`${canonical}/quiz`)}`}
								aria-current="page"
							>
								Quizzes
							</Link>
						</li>
					</Nav>
					<Nav as="ul">
						{auth?.data?.isOnline ? (
							<>
								{auth?.data?.role.includes("founder") && (
									<>
										<li className="nav-item">
											<Link
												href={{
													pathname: `${canonical}/noadmin`,
													query: {},
												}}
												className={`nav-link ${isActive(
													`${canonical}/noadmin`
												)}`}
												aria-current="page"
											>
												Admin
											</Link>
										</li>
										<li className="nav-item">
											<Link
												href={{
													pathname: `${canonical}/nfabusiness`,
													query: {},
												}}
												className={`nav-link ${isActive(
													`${canonical}/nfabusiness`
												)}`}
												aria-current="page"
											>
												NFA Business
											</Link>
										</li>
									</>
								)}
								<li className="nav-item">
									<Link
										href={{
											pathname: `${canonical}/dashboard`,
											query: {},
										}}
										className={`nav-link ${isActive(`${canonical}/dashboard`)}`}
										aria-current="page"
									>
										Dashboard
									</Link>
								</li>
								<li className="nav-item">
									<Link
										href={{
											pathname: `${canonical}/auth/profile`,
											query: {},
										}}
										className={`nav-link ${isActive(
											`${canonical}/auth/profile`
										)}`}
										aria-current="page"
									>
										Account
									</Link>
								</li>
								<li className="nav-item">
									<Link
										href={{
											pathname: `${canonical}/profile/${auth?.data?._id}/${auth?.data?.username}`,
											query: {},
										}}
										className={`nav-link ${isActive(
											`${canonical}/profile/${auth?.data?._id}/${auth?.data?.username}`
										)}`}
										aria-current="page"
									>
										{auth.data.username}
									</Link>
								</li>
								<li className="nav-item">
									<button
										className="btn btn-link"
										onClick={async () => {
											await deleteAuthTokenOnServer();
										}}
									>
										Log Out
									</button>
								</li>
							</>
						) : (
							<>
								<Link
									href={{
										pathname: `${canonical}/auth/login`,
										query: {},
									}}
									className={`nav-link ${isActive(`${canonical}/auth/login`)}`}
								>
									Log In
								</Link>
								<Link
									href={{
										pathname: `${canonical}/auth/register`,
										query: {},
									}}
									className={`nav-link ${isActive(
										`${canonical}/auth/register`
									)}`}
								>
									Register
								</Link>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Menu;
