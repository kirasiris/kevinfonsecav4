"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Globalsidebar from "../sidebar";

const Sidebar = ({ quotes = [], categories = [] }) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/course/search?keyword=${keyword}&page=1&limit=32&sort=-createdAt`
		);
	};

	return (
		<Globalsidebar>
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
									pathname: `/course/category/development`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Development
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/web-development`,
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
											pathname: `/course/subcategory/mobile-development`,
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
											pathname: `/course/subcategory/programming-languages`,
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
											pathname: `/course/subcategory/game-development`,
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
											pathname: `/course/subcategory/database-design-and-development`,
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
											pathname: `/course/subcategory/software-testing`,
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
									pathname: `/course/category/business`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Business
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/entrepreneurship`,
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
											pathname: `/course/subcategory/communication`,
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
											pathname: `/course/subcategory/management`,
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
											pathname: `/course/subcategory/sales`,
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
											pathname: `/course/subcategory/business-strategy`,
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
									pathname: `/course/category/finance-and-accounting`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Finance and Accounting
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/accounting-and-bookkeeping`,
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
											pathname: `/course/subcategory/cryptocurrency-and-blockchain`,
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
											pathname: `/course/subcategory/finance`,
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
											pathname: `/course/subcategory/financial-modeling-and-analysis`,
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
											pathname: `/course/subcategory/investing-and-trading`,
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
									pathname: `/course/category/it-and-software`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								IT and Software
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/it-certifications`,
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
											pathname: `/course/subcategory/network-and-security`,
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
											pathname: `/course/subcategory/hardware`,
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
											pathname: `/course/subcategory/operating-systems-and-servers`,
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
											pathname: `/course/subcategory/other-it-and-software`,
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
									pathname: `/course/category/office-productivity`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Office Productivity
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/microsoft`,
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
											pathname: `/course/subcategory/apple`,
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
											pathname: `/course/subcategory/google`,
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
											pathname: `/course/subcategory/sap`,
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
											pathname: `/course/subcategory/oracle`,
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
											pathname: `/course/subcategory/other-office-productivity`,
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
									pathname: `/course/category/personal-development`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Personal Development
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/personal-transformation`,
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
											pathname: `/course/subcategory/personal-productivity`,
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
											pathname: `/course/subcategory/leadership`,
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
											pathname: `/course/subcategory/career-development`,
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
											pathname: `/course/subcategory/parenting-and-relationships`,
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
									pathname: `/course/category/design`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Design
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/web-design`,
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
											pathname: `/course/subcategory/graphic-design-and-illustration`,
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
											pathname: `/course/subcategory/design-tools`,
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
											pathname: `/course/subcategory/user-experience-design`,
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
											pathname: `/course/subcategory/game-design`,
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
											pathname: `/course/subcategory/3d-and-animation`,
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
									pathname: `/course/category/marketing`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Marketing
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/digital-marketing`,
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
											pathname: `/course/subcategory/search-engine-optimization`,
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
											pathname: `/course/subcategory/social-media-marketing`,
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
											pathname: `/course/subcategory/branding`,
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
											pathname: `/course/subcategory/marketing-fundamentals`,
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
											pathname: `/course/subcategory/marketing-analytics-and-automation`,
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
									pathname: `/course/category/health-and-fitness`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Health and Fitness
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/fitness`,
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
											pathname: `/course/subcategory/general-health`,
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
											pathname: `/course/subcategory/sports`,
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
											pathname: `/course/subcategory/nutrition-and-diet`,
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
											pathname: `/course/subcategory/yoga`,
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
											pathname: `/course/subcategory/mental-health`,
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
									pathname: `/course/category/music`,
									query: {
										page: 1,
										limit: 32,
										sort: `-createdAt`,
									},
								}}
								className="btn btn-link btn-sm"
							>
								Music
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/instruments`,
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
											pathname: `/course/subcategory/music-production`,
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
											pathname: `/course/subcategory/music-fundamentals`,
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
											pathname: `/course/subcategory/vocal`,
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
											pathname: `/course/subcategory/music-techniques`,
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
											pathname: `/course/subcategory/music-software`,
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
