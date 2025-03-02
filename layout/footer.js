"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import Toggletheme from "./toggletheme";

const Footer = ({
	classList = "",
	styleList = {},
	canonical = process.env.NEXT_PUBLIC_WEBSITE_URL,
	menus = [],
}) => {
	return (
		<footer className={`py-5 mt-4 bg-dark ${classList}`} style={styleList}>
			<div className="container">
				<div className="text-center text-white">
					<p>
						<button className="btn btn-light btn-sm" type="button">
							&lt;/&gt;
						</button>
						&nbsp;made&nbsp;with&nbsp;
						<button className="btn btn-light btn-sm" type="button">
							&#10084;
						</button>
						&nbsp;&#38;&nbsp;
						<button className="btn btn-light btn-sm" type="button">
							&#9749;
						</button>
					</p>
					<p>
						BY&nbsp;
						<a
							href={process.env.NEXT_PUBLIC_WEBSITE_URL}
							className="btn btn-secondary btn-sm"
						>
							KEVIN&nbsp;URIEL
						</a>
						&nbsp;
						<Toggletheme />
					</p>
				</div>
				<hr />
				<div
					className="row text-white"
					style={{
						wordBreak: "break-word",
					}}
				>
					<div className="col-lg-3">
						<h5>About</h5>
						<ul className="nav flex-column">
							{menus
								.filter((m) => m?.resourceId?.slug === "footer-1")
								.sort((a, b) => a.orderingNumber - b.orderingNumber)
								.map((p, index) => (
									<li key={index} className="nav-item mb-2">
										{p.target === "_self" ? (
											<>
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
											</>
										) : (
											<a href={p.url} target="_blank" rel="noreferrer noopener">
												{p.title}
											</a>
										)}
									</li>
								))}
							<li className="list-group-item mb-2">
								<a
									href="http://validator.w3.org/feed/check.cgi"
									target="_blank"
									rel="noreferrer noopener"
								>
									<Image
										src="/valid-rss-rogers.png"
										alt="[Valid RSS]"
										title="Validate my RSS feed"
										width={88}
										height={31}
									/>
								</a>
							</li>
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
						<h5>Menu</h5>
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
			<ToastContainer />
		</footer>
	);
};

export default Footer;
