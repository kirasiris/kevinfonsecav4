"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = ({ quotes = [], categories = [] }) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(`/course/search?keyword=${keyword}&page=1&limit=32`);
	};

	return (
		<>
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
			{/* Categories box */}
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
											pathname: `/course/subcategory/web-development`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/mobile-development`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/programming-languages`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/game-development`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/database-design-and-development`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/software-testing`,
											query: {
												page: 1,
												limit: 32,
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
									pathname: `/course/category/business`,
									query: {
										page: 1,
										limit: 32,
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
											pathname: `/course/subcategory/entrepreneurship`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/communication`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/management`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/sales`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/business-strategy`,
											query: {
												page: 1,
												limit: 32,
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
									pathname: `/course/category/finance-and-accounting`,
									query: {
										page: 1,
										limit: 32,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="btn btn-link btn-sm">Finance And Accounting</a>
							</Link>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/accounting-and-bookkeeping`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Accounting And Bookkeeping
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/cryptocurrency-and-blockchain`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Cryptocurrency And Blockchain
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/finance`,
											query: {
												page: 1,
												limit: 32,
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
											pathname: `/course/subcategory/financial-modeling-and-analysis`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">
											Financial Modeling And Analysis
										</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link
										href={{
											pathname: `/course/subcategory/investing-and-trading`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="btn btn-link btn-sm">Investing And Trading</a>
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
