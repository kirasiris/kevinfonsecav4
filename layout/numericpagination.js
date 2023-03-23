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
	// const current = pagesArrayInfo.current;
	// const last_page = pagesArrayInfo.pages.length;
	// function paginate(current, last_page, onSides = 3) {
	// 	let pages = [];
	// 	for (let i = 1; i <= last_page; i++) {
	// 		// Define offset
	// 		let offset = i == 1 || last_page ? onSides + 1 : onSides;
	// 		// If added
	// 		if (
	// 			i == 1 ||
	// 			(current - offset <= i && current + offset >= i) ||
	// 			i == current ||
	// 			i == last_page
	// 		) {
	// 			pages.push(i);
	// 		} else if (i == current - (offset + 1) || i == current + (offset + 1)) {
	// 			pages.push("...");
	// 		}
	// 	}
	// 	return pages;
	// }

	const firstItem = () => {
		return (
			prev !== undefined &&
			prev !== 0 && (
				<li className="page-item">
					<Link
						href={{
							pathname: pagePath,
							query: { page: pagesArrayInfo.pages[0], limit: pageParams.limit },
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
			<nav aria-label="Pagination">
				<ul className="pagination justify-content-center my-4">
					{/* FIRST/PREVIOUS */}
					{firstItem()}
					{prevButton()}
					{/* NUMERIC PAGINATION */}
					{pagesArrayInfo.pages
						.filter((p) => p < pageParams.limit)
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
										query: { page: p, limit: pageParams.limit },
									}}
									className={`page-link`}
								>
									{p}
								</Link>
							</li>
						))}
					{/* {paginate(pagesArrayInfo.current, pagesArrayInfo.pages.length, 3)} */}
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
