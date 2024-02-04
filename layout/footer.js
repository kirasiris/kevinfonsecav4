"use client";
import Link from "next/link";
import ToggleTheme from "./toggletheme";

const Footer = ({ auth = {}, classes = "", styles = {}, canonical = "" }) => {
	return (
		<footer className={`py-5 mt-4 bg-dark ${classes}`} style={styles}>
			<div className="container">
				<p className="m-0 text-center text-white d-flex align-items-center justify-content-center">
					Made with &#10084; &#38; &#9749; by KEVIN URIEL <ToggleTheme />
				</p>
				<hr />
				<div
					className="row text-white"
					style={{
						wordBreak: "break-word",
					}}
				>
					<div className="col-lg-3">
						<h5>Menu</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/openai/generateimage",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									Generate AI Image
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/openai/generatecode",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									Generate AI Code
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/changelog",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									Changelog
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Tools</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/youtube",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									YouTube
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/restful",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									RESTFUL Tester
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/opengraphviewer",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									OpenGraph Viewer
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/livecode",
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									HTML, CSS and JS Viewer
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/mongodbcompiler`,
										query: {
											page: undefined,
											limit: undefined,
										},
									}}
									passHref
									legacyBehavior
								>
									MongoDB Compiler
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Mind to donate?</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<a
									rel="noreferrer noopener"
									href="https://www.paypal.com/paypalme/kirasiris"
									target="_blank"
								>
									<i className="fa fa-paypal me-1" aria-hidden />
									PayPal
								</a>
							</li>
							<li className="nav-item mb-2">
								<a
									href="https://wordpress.com/refer-a-friend/AgJ8XA6iNz1XmnGwkWYQ/"
									target="_blank"
									rel="noreferrer noopener"
								>
									<i className="fa fa-wordpress me-1" aria-hidden />
									WordPress
								</a>
							</li>
							<li className="nav-item mb-2">
								<a
									href="https://cash.app/$kirasiris"
									target="_blank"
									rel="noreferrer noopener"
								>
									<i className="fa fa-dollar-sign me-1" aria-hidden />
									CashApp
								</a>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>About</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/profile//62ec7926a554425c9e03782d/kirasiris`,
										query: {
											page: 1,
											limit: 10,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Kevin?</a>
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/blog`,
										query: {
											page: 1,
											limit: 10,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Blog</a>
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/theme`,
										query: {
											page: 1,
											limit: 10,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Themes</a>
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/video`,
										query: {
											page: 1,
											limit: 32,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Videos</a>
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-lg-12">
						<h5>Disclaimer</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<p>
									All of the articles found on this website are owned by me.
								</p>
								<p>
									Every opinion, though, say,etc is said by me, myself and I;
									not a single company or any other individual other than me
									should be held accountable
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
