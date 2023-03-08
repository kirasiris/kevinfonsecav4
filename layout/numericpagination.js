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
				<Link
					href={{
						pathname: pagePath,
						query: { page: pagesArrayInfo.pages[0], limit: pageParams.limit },
					}}
					className="page-link"
				>
					First
				</Link>
			)
		);
	};

	const lastItem = () => {
		return (
			next !== undefined &&
			next !== 0 && (
				<Link
					href={{
						pathname: pagePath,
						query: {
							page: pagesArrayInfo.pages.length,
							limit: pageParams.limit,
						},
					}}
					className="page-link"
				>
					Last
				</Link>
			)
		);
	};

	const nextButton = () => {
		return (
			next !== "undefined" &&
			next !== 0 && (
				<Link href={`/blog${nextParams}`} className={`page-link rounded-0`}>
					Next
				</Link>
			)
		);
	};

	const prevButton = () => {
		return (
			prev !== undefined &&
			prev !== 0 && (
				<Link href={`/blog${prevParams}`} className={`page-link rounded-0`}>
					Previous
				</Link>
			)
		);
	};

	const numericPagination = () => {
		return (
			<nav aria-label="Pagination">
				<ul className="pagination justify-content-center my-4">
					{/* FIRST/PREVIOUS */}
					<li className="page-item">{firstItem()}</li>
					<li className="page-item previous-item">{prevButton()}</li>
					{/* NUMERIC PAGINATION */}
					{pagesArrayInfo.pages.split(0, 5).map((p, index) => (
						<li
							key={p}
							id={p}
							className={`page-item number-item page-${
								pagesArrayInfo.pages[index]
							} ${
								pagesArrayInfo.pages[index] === pageParams.page ? "active" : ""
							}`}
						>
							<Link
								href={{
									pathname: pagePath,
									query: { page: p, limit: pageParams.limit },
								}}
								className={`page-link`}
							>
								{p}
							</Link>
						</li>
					))}
					{/* LAST/NEXT */}
					<li className={`page-item next-item`}>{nextButton()}</li>
					<li className="page-item">{lastItem()}</li>
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
