"use client";
import Link from "next/link";
// ACTIONS
// HELPERS
const NumericPagination = ({
	nextParams = ``,
	prevParams = ``,
	next = 0,
	prev = 0,
	componentMapping,
	pageArray = [],
	pagePath = "/",
	pageParams = {},
}) => {
	const firstItem = () => {
		return (
			prev !== "undefined" &&
			prev !== 0 && (
				<Link
					href={{
						pathname: pagePath,
						query: { page: pageArray[0], limit: pageParams.limit },
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
			next !== "undefined" &&
			next !== 0 && (
				<Link
					href={{
						pathname: pagePath,
						query: { page: pageArray.length, limit: pageParams.limit },
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
				<button
					onClick={() => {
						history.push(nextParams);
					}}
					className={`page-link rounded-0`}
				>
					Next Page
				</button>
			)
		);
	};

	const prevButton = () => {
		return (
			prev !== "undefined" &&
			prev !== 0 && (
				<button
					onClick={() => {
						router.push(prevParams);
					}}
					className={`page-link rounded-0`}
				>
					Previous Page
				</button>
			)
		);
	};

	const numericPagination = () => {
		return (
			<nav aria-label="Pagination">
				<hr className="my-0" />
				<ul className="pagination justify-content-center my-4">
					{/* FIRST/PREVIOUS */}
					<li className="page-item">{firstItem()}</li>
					<li className="page-item previous-item">{prevButton()}</li>
					{/* NUMERIC PAGINATION */}
					{pageArray.map((p, index) => (
						<li
							key={index}
							className={`page-item number-item page-${pageArray[index]} ${
								pageArray[index] === pageParams.page ? "active" : ""
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
			{pageArray.length >= pageParams.limit && (
				<div className={`paginationButtons`}>{numericPagination()}</div>
			)}
		</>
	);
};

export default NumericPagination;
