"use client";
import Link from "next/link";
import ToggleTheme from "./toggletheme";

const Footer = ({
	auth = {},
	classes = "",
	styles = {},
	canonical = "",
	menus = [],
}) => {
	return (
		<footer className={`py-5 mt-4 bg-dark ${classes}`} style={styles}>
			<div className="container">
				<p className="m-0 text-center text-white d-flex align-items-center justify-content-center">
					Made&nbsp;with&nbsp;&#10084;&nbsp;&#38;&nbsp;&#9749;&nbsp;by&nbsp;KEVIN&nbsp;URIEL&nbsp;
					<ToggleTheme />
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
							{menus
								.filter((m) => m?.resourceId?.slug === "footer-1")
								.sort((a, b) => a.orderingNumber - b.orderingNumber)
								.map((p, index) => (
									<li key={index} className="nav-item mb-2">
										{p.target === "_self" ? (
											<Link
												href={{
													pathname: decodeURI(`${canonical}${p.url}`),
													query: {},
												}}
												passHref
												legacyBehavior
											>
												{p.title}
											</Link>
										) : (
											<a href={p.url} target="_blank" rel="noreferrer noopener">
												{p.title}
											</a>
										)}
									</li>
								))}
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Tools</h5>
						<ul className="nav flex-column">
							{menus
								.filter((m) => m?.resourceId?.slug === "footer-2")
								.sort((a, b) => a.orderingNumber - b.orderingNumber)
								.map((p, index) => (
									<li key={index} className="nav-item mb-2">
										{p.target === "_self" ? (
											<Link
												href={{
													pathname: decodeURI(`${canonical}${p.url}`),
													query: {},
												}}
												passHref
												legacyBehavior
											>
												{p.title}
											</Link>
										) : (
											<a href={p.url} target="_blank" rel="noreferrer noopener">
												{p.title}
											</a>
										)}
									</li>
								))}
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Mind&nbsp;to&nbsp;donate?</h5>
						<ul className="nav flex-column">
							{menus
								.filter((m) => m?.resourceId?.slug === "footer-3")
								.sort((a, b) => a.orderingNumber - b.orderingNumber)
								.map((p, index) => (
									<li key={index} className="nav-item mb-2">
										{p.target === "_self" ? (
											<Link
												href={{
													pathname: decodeURI(`${canonical}${p.url}`),
													query: {},
												}}
												passHref
												legacyBehavior
											>
												{p.title}
											</Link>
										) : (
											<a href={p.url} target="_blank" rel="noreferrer noopener">
												{p.title}
											</a>
										)}
									</li>
								))}
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>About</h5>
						<ul className="nav flex-column">
							{menus
								.filter((m) => m?.resourceId?.slug === "footer-4")
								.sort((a, b) => a.orderingNumber - b.orderingNumber)
								.map((p, index) => (
									<li key={index} className="nav-item mb-2">
										{p.target === "_self" ? (
											<Link
												href={{
													pathname: decodeURI(`${canonical}${p.url}`),
													query: {},
												}}
												passHref
												legacyBehavior
											>
												{p.title}
											</Link>
										) : (
											<a href={p.url} target="_blank" rel="noreferrer noopener">
												{p.title}
											</a>
										)}
									</li>
								))}
						</ul>
					</div>
					<hr />
					<div className="col-lg-12">
						<h5>Disclaimer</h5>
						<ul className="nav flex-column">
							<li className="nav-item mb-2">
								<p>
									All&nbsp;of&nbsp;the&nbsp;articles&nbsp;found&nbsp;on&nbsp;this&nbsp;website&nbsp;are&nbsp;owned&nbsp;by&nbsp;me.
								</p>
								<p>
									Every&nbsp;opinion,&nbsp;though,&nbsp;say,etc&nbsp;is&nbsp;said&nbsp;by&nbsp;me,&nbsp;myself&nbsp;and&nbsp;I;
									not&nbsp;a&nbsp;single&nbsp;company&nbsp;or&nbsp;any&nbsp;other&nbsp;individual&nbsp;other&nbsp;than&nbsp;me
									should&nbsp;be&nbsp;held&nbsp;accountable
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
