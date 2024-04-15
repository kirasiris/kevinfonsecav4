"use client";
import Link from "next/link";
import ToggleTheme from "./toggletheme";

const Footer = ({ auth = {}, classes = "", styles = {}, canonical = "" }) => {
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
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/openai/generateimage",
										query: {},
									}}
									passHref
									legacyBehavior
								>
									Generate&nbsp;AI&nbsp;Image
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/openai/generatecode",
										query: {},
									}}
									passHref
									legacyBehavior
								>
									Generate&nbsp;AI&nbsp;Code
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/changelog",
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
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
										query: {},
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
										query: {},
									}}
									passHref
									legacyBehavior
								>
									RESTFUL&nbsp;Tester
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/opengraphviewer",
										query: {},
									}}
									passHref
									legacyBehavior
								>
									OpenGraph&nbsp;Viewer
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: "/livecode",
										query: {},
									}}
									passHref
									legacyBehavior
								>
									HTML,&nbsp;CSS&nbsp;and&nbsp;JS&nbsp;Viewer
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/mongodbcompiler`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									MongoDB&nbsp;Compiler
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-lg-3">
						<h5>Mind&nbsp;to&nbsp;donate?</h5>
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
										pathname: `${canonical}/profile/660600aa29a40c04c35d6188/kirasiris`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
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
											sort: `-createdAt`,
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
											sort: `-createdAt`,
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
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Videos</a>
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/anime`,
										query: {
											page: 1,
											limit: 24,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Animes</a>
								</Link>
							</li>
							<li className="nav-item mb-2">
								<Link
									href={{
										pathname: `${canonical}/course`,
										query: {
											page: 1,
											limit: 32,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a aria-current="page">Courses</a>
								</Link>
							</li>
						</ul>
					</div>
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
