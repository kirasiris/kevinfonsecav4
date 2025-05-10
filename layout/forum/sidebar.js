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
							>
								Development
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
										className="btn btn-link btn-sm"
									>
										Web Development
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
										className="btn btn-link btn-sm"
									>
										Mobile Development
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
										className="btn btn-link btn-sm"
									>
										Programming Languages
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
										className="btn btn-link btn-sm"
									>
										Game Development
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
										className="btn btn-link btn-sm"
									>
										Database Design and Development
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
										className="btn btn-link btn-sm"
									>
										Software Testing
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
							>
								Business
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
										className="btn btn-link btn-sm"
									>
										Entrepreneurship
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
										className="btn btn-link btn-sm"
									>
										Communication
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
										className="btn btn-link btn-sm"
									>
										Management
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
										className="btn btn-link btn-sm"
									>
										Sales
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
										className="btn btn-link btn-sm"
									>
										Business Strategy
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
							>
								Finance and Accounting
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
										className="btn btn-link btn-sm"
									>
										Accounting and Bookkeeping
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
										className="btn btn-link btn-sm"
									>
										Cryptocurrency and Blockchain
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
										className="btn btn-link btn-sm"
									>
										Finance
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
										className="btn btn-link btn-sm"
									>
										Financial Modeling and Analysis
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
										className="btn btn-link btn-sm"
									>
										Investing and Trading
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
							>
								IT and Software
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
										className="btn btn-link btn-sm"
									>
										IT Certifications
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
										className="btn btn-link btn-sm"
									>
										Network and Security
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
										className="btn btn-link btn-sm"
									>
										Hardware
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
										className="btn btn-link btn-sm"
									>
										Operating Systems and Servers
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
										className="btn btn-link btn-sm"
									>
										Other IT and Software
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
							>
								Office Productivity
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
										className="btn btn-link btn-sm"
									>
										Microsoft
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
										className="btn btn-link btn-sm"
									>
										Apple
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
										className="btn btn-link btn-sm"
									>
										Google
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
										className="btn btn-link btn-sm"
									>
										SAP
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
										className="btn btn-link btn-sm"
									>
										Oracle
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
										className="btn btn-link btn-sm"
									>
										Other Office Productivity
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
							>
								Personal Development
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
										className="btn btn-link btn-sm"
									>
										Personal Transformation
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
										className="btn btn-link btn-sm"
									>
										Personal Productivity
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
										className="btn btn-link btn-sm"
									>
										Leadership
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
										className="btn btn-link btn-sm"
									>
										Career Development
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
										className="btn btn-link btn-sm"
									>
										Parenting and Relationships
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
							>
								Design
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
										className="btn btn-link btn-sm"
									>
										Web Design
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
										className="btn btn-link btn-sm"
									>
										Graphic Design and Illustration
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
										className="btn btn-link btn-sm"
									>
										Design Tools
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
										className="btn btn-link btn-sm"
									>
										User Experience Design
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
										className="btn btn-link btn-sm"
									>
										Game Design
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
										className="btn btn-link btn-sm"
									>
										3D and Animation
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
							>
								Marketing
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
										className="btn btn-link btn-sm"
									>
										Digital Marketing
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
										className="btn btn-link btn-sm"
									>
										Search Engine Optimization
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
										className="btn btn-link btn-sm"
									>
										Social Media Marketing
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
										className="btn btn-link btn-sm"
									>
										Branding
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
										className="btn btn-link btn-sm"
									>
										Marketing Fundamentals
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
										className="btn btn-link btn-sm"
									>
										Marketing Analytics and Automation
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
							>
								Health and Fitness
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
										className="btn btn-link btn-sm"
									>
										Fitness
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
										className="btn btn-link btn-sm"
									>
										General Health
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
										className="btn btn-link btn-sm"
									>
										Sports
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
										className="btn btn-link btn-sm"
									>
										Nutrition and Diet
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
										className="btn btn-link btn-sm"
									>
										Yoga
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
										className="btn btn-link btn-sm"
									>
										Mental Health
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
							>
								Music
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
										className="btn btn-link btn-sm"
									>
										Instruments
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
										className="btn btn-link btn-sm"
									>
										Music Production
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
										className="btn btn-link btn-sm"
									>
										Music Fundamentals
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
										className="btn btn-link btn-sm"
									>
										Vocal
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
										className="btn btn-link btn-sm"
									>
										Music Techniques
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
										className="btn btn-link btn-sm"
									>
										Music Software
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
