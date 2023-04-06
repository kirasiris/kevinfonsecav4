"use client";
import Link from "next/link";
import router from "next/router";
import { useEffect } from "react";

// ACTIONS
// HELPERS
const NumericPagination = ({
	nextParams = ``,
	prevParams = ``,
	next = 0,
	prev = 0,
	componentMapping,
	pagesArrayInfo = {},
	pagePath = "/",
	pageParams = {},
}) => {
	const firstItem = () => {
		return (
			prev !== undefined &&
			prev !== 0 && (
				<li className="page-item">
					<Link
						href={{
							pathname: pagePath,
							query: {
								...pageParams,
								page: pagesArrayInfo.pages[0],
								limit: pageParams.limit,
							},
						}}
						className="page-link"
					>
						First
					</Link>
				</li>
			)
		);
	};

	const lastItem = () => {
		return (
			next !== undefined &&
			next !== 0 && (
				<li className="page-item">
					<Link
						href={{
							pathname: pagePath,
							query: {
								...pageParams,
								page: pagesArrayInfo.pages.length,
								limit: pageParams.limit,
							},
						}}
						className="page-link"
					>
						Last
					</Link>
				</li>
			)
		);
	};

	const nextButton = () => {
		return (
			next !== "undefined" &&
			next !== 0 && (
				<li className={`page-item next-item`}>
					<Link href={nextParams} className={`page-link rounded-0`}>
						Next
					</Link>
				</li>
			)
		);
	};

	const prevButton = () => {
		return (
			prev !== undefined &&
			prev !== 0 && (
				<li className="page-item previous-item">
					<Link href={prevParams} className={`page-link rounded-0`}>
						Previous
					</Link>
				</li>
			)
		);
	};

	const numericPagination = () => {
		return (
			<nav aria-label="pagination">
				<ul className="pagination justify-content-center my-4">
					{/* FIRST/PREVIOUS */}
					{firstItem()}
					{prevButton()}
					{/* NUMERIC PAGINATION */}
					{pagesArrayInfo.pages
						// .filter((p) => p < pageParams.limit)
						.map((p, index) => (
							<li
								key={p}
								id={p}
								className={`page-item number-item page-${
									pagesArrayInfo.pages[index]
								} ${
									pagesArrayInfo.pages[index] === pageParams.page
										? "active"
										: ""
								}`}
							>
								<Link
									href={{
										pathname: pagePath,
										query: { ...pageParams, page: p, limit: pageParams.limit },
									}}
									className={`page-link`}
								>
									{p}
								</Link>
							</li>
						))}

					{/* LAST/NEXT */}
					{nextButton()}
					{lastItem()}
				</ul>
			</nav>
		);
	};

	return (
		<>
			{componentMapping}
			{pagesArrayInfo.pages?.length >= pageParams.limit && numericPagination()}
		</>
	);
};

export default NumericPagination;
