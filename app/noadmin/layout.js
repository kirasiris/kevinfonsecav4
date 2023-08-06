"use client";
import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../global.css";
import "../admin.css";
import "../app.css";
import AdminSidebar from "@/layout/admin/sidebar";

export default function AdminLayout({ children }) {
	return (
		<>
			<Navbar
				collapseOnSelect
				expand="lg"
				bg="dark"
				variant="dark"
				className="mb-4"
			>
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
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<div className="container-fluid">
				<div className="row">
					<AdminSidebar />
					<div className="col-lg-9">{children}</div>
				</div>
			</div>
		</>
	);
}
