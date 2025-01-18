"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Globalsidebar from "../sidebar";

const Sidebar = ({}) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/forum/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
		);
	};

	return (
		<Globalsidebar>
			{/* Search box */}
			<div className="card mb-4">
				<div className="card-header">Search</div>
				<div className="card-body">
					<form onSubmit={searchData}>
						<div className="input-group">
							<input
								id="keyword"
								name="keyword"
								value={keyword}
								onChange={(e) => {
									setSearchParams({
										...searchParams,
										keyword: e.target.value,
									});
								}}
								type="text"
								className="form-control"
								placeholder="Enter search term..."
							/>
							<button
								type="submit"
								className="btn btn-secondary"
								disabled={keyword.length > 0 ? !true : !false}
							>
								Go!
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="card mb-4">
				<div className="card-header">Categories</div>
				<div className="card-body p-0">
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/development`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Development</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/web-development`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Web Development</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/mobile-development`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Mobile Development</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/programming-languages`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Programming Languages</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/game-development`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Game Development</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/database-design-and-development`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Database Design and Development
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/development/subcategory/software-testing`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Software Testing</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/business`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Business</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/business/subcategory/entrepreneurship`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Entrepreneurship</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/business/subcategory/communication`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Communication</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/business/subcategory/management`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Management</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/business/subcategory/sales`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Sales</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/business/subcategory/business-strategy`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Business Strategy</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/finance-and-accounting`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Finance and Accounting</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/finance-and-accounting/subcategory/accounting-and-bookkeeping`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Accounting and Bookkeeping
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/finance-and-accounting/subcategory/cryptocurrency-and-blockchain`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Cryptocurrency and Blockchain
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/finance-and-accounting/subcategory/finance`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Finance</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/finance-and-accounting/subcategory/financial-modeling-and-analysis`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Financial Modeling and Analysis
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/finance-and-accounting/subcategory/investing-and-trading`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Investing and Trading</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/it-and-software`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">IT and Software</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/it-and-software/subcategory/it-certifications`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">IT Certifications</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/it-and-software/subcategory/network-and-security`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Network and Security</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/it-and-software/subcategory/hardware`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Hardware</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/it-and-software/subcategory/operating-systems-and-servers`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Operating Systems and Servers
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/it-and-software/subcategory/other-it-and-software`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Other IT and Software</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/office-productivity`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Office Productivity</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/microsoft`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Microsoft</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/apple`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Apple</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/google`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Google</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/sap`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">SAP</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/oracle`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Oracle</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/office-productivity/subcategory/other-office-productivity`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Other Office Productivity
										</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/personal-development`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Personal Development</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/personal-development/subcategory/personal-transformation`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Personal Transformation
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/personal-development/subcategory/personal-productivity`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Personal Productivity</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/personal-development/subcategory/leadership`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Leadership</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/personal-development/subcategory/career-development`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Career Development</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/personal-development/subcategory/parenting-and-relationships`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Parenting and Relationships
										</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/design`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Design</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/web-design`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Web Design</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/graphic-design-and-illustration`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Graphic Design and Illustration
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/design-tools`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Design Tools</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/user-experience-design`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											User Experience Design
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/game-design`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Game Design</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/design/subcategory/3d-and-animation`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">3D and Animation</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/marketing`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Marketing</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/digital-marketing`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Digital Marketing</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/search-engine-optimization`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Search Engine Optimization
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/social-media-marketing`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Social Media Marketing
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/branding`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Branding</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/marketing-fundamentals`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Marketing Fundamentals
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/marketing/subcategory/marketing-analytics-and-automation`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Marketing Analytics and Automation
										</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/health-and-fitness`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Health and Fitness</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/fitness`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Fitness</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/general-health`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">General Health</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/sports`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Sports</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/nutrition-and-diet`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Nutrition and Diet</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/yoga`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Yoga</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/health-and-fitness/subcategory/mental-health`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Mental Health</a>
									</Link>
								</li>
							</ul>
						</li>
						<li className="list-group-item">
							<Link
								href={{
									pathname: `/forum/category/music`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Music</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/instruments`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Instruments</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/music-production`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Music Production</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/music-fundamentals`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Music Fundamentals</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/vocal`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Vocal</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/music-techniques`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Music Techniques</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/forum/category/music/subcategory/music-software`,
											query: {
												page: 1,
												limit: 32,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Music Software</a>
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</Globalsidebar>
	);
};

export default Sidebar;
