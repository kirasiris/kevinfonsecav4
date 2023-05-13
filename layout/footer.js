"use client";
import Link from "next/link";
import ToggleTheme from "./toggletheme";

const Footer = ({ classes = "", styles = {} }) => {
	return (
		<footer className={`py-5 mt-4 bg-dark ${classes}`} style={styles}>
			<div className="container">
				<p className="m-0 text-center text-white">
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
								<p>
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
								</p>
							</li>
							<li className="nav-item mb-2">
								<p>
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
								</p>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Tools</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<p>
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
								</p>
							</li>
							<li className="nav-item mb-2">
								<p>
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
								</p>
							</li>
							<li className="nav-item mb-2">
								<p>
									<Link
										href={{
											pathname: "/sqlcompiler",
											query: {
												page: undefined,
												limit: undefined,
											},
										}}
										passHref
										legacyBehavior
									>
										SQL Compiler
									</Link>
								</p>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Mind to donate?</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<p>
									<a
										rel="noreferrer noopener"
										href="https://www.paypal.com/paypalme/kirasiris"
										target="_blank"
									>
										https://www.paypal.com/paypalme/kirasiris
									</a>
								</p>
							</li>
							<li className="nav-item mb-2">
								<p>
									<a
										href="https://wordpress.com/refer-a-friend/AgJ8XA6iNz1XmnGwkWYQ/"
										target="_blank"
										rel="noreferrer noopener"
									>
										https://wordpress.com/refer-a-friend/AgJ8XA6iNz1XmnGwkWYQ/
									</a>
								</p>
							</li>
							<li className="nav-item mb-2">
								<p>
									<a
										href="https://cash.app/$kirasiris"
										target="_blank"
										rel="noreferrer noopener"
									>
										https://cash.app/$kirasiris
									</a>
								</p>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Calendar</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">fgfdgfd</li>
						</ul>
					</div>
					<div className="col-lg-12">
						<h5>About</h5>
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
