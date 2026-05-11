"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

function range(start, end) {
	const length = Math.max(end - start, 0);
	const result = new Array(length);
	for (let i = 0; i < length; i++) {
		result[i] = start + i;
	}
	return result;
}

const NumericPagination = ({
	totalPages,
	searchParams = {},
	siblings = 1,
	isAdmin = true,
}) => {
	// Initialize router
	const router = useRouter();

	const page = Number(searchParams.page) || 1;
	const limit = Number(searchParams.limit) || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt || "";
	const random = searchParams.random || "";
	const email = searchParams.email || "";
	const keyword = searchParams.keyword || "";
	const posttype = searchParams.postType || "";

	// Coerce to numbers once, upfront — this fixes the string concatenation bug
	const totalPagesNum = Number(totalPages);
	const siblingsNum = Number(siblings);

	// Clamp current page to a valid range
	const currentPage = Math.max(1, Math.min(page, totalPagesNum));

	/**
	 * Build an href preserving every active query parameter.
	 * Uses URLSearchParams so values are properly encoded.
	 */
	const buildHref = (targetPage) => {
		const params = new URLSearchParams();
		params.set("page", String(targetPage));
		params.set("limit", String(limit));
		params.set("sort", sort);
		if (keyword) params.set("keyword", keyword);
		if (posttype) params.set("postType", posttype);
		if (decrypt === "true") params.set("decrypt", "true");
		if (random === "true") params.set("random", "true");
		if (email) params.set("email", email);
		return `?${params.toString()}`;
	};

	/**
	 * Generate the pagination range array.
	 * Uses unique string tokens for dots so React keys never collide.
	 */
	const getPaginationRange = () => {
		const totalSlots = 7 + siblingsNum;

		// If every page fits, just list them all
		if (totalSlots >= totalPagesNum) {
			return range(1, totalPagesNum + 1);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingsNum, 1);
		const rightSiblingIndex = Math.min(
			currentPage + siblingsNum,
			totalPagesNum,
		);

		const showLeftDots = leftSiblingIndex > 2;
		const showRightDots = rightSiblingIndex < totalPagesNum - 2;

		if (!showLeftDots && showRightDots) {
			// Near the start — show a longer left run, then dots, then last page
			const leftItemsCount = 3 + 2 * siblingsNum;
			const leftRange = range(1, leftItemsCount + 1);
			return [...leftRange, "dots-right", totalPagesNum];
		}

		if (showLeftDots && !showRightDots) {
			// Near the end — first page, dots, then a longer right run
			const rightItemsCount = 3 + 2 * siblingsNum;
			const rightRange = range(
				totalPagesNum - rightItemsCount + 1,
				totalPagesNum + 1,
			);
			return [1, "dots-left", ...rightRange];
		}

		// In the middle — first page, dots, siblings, dots, last page
		const middleRange = range(leftSiblingIndex, rightSiblingIndex + 1);
		return [1, "dots-left", ...middleRange, "dots-right", totalPagesNum];
	};

	const paginationRange = getPaginationRange();
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPagesNum;

	const handlePageLimit = (value) => {
		router.push(
			`?page=${Number(currentPage)}&limit=${Number(value)}${newParams}`,
		);
	};

	const selectLimit = () => {
		return (
			<select
				id="pagination"
				name="pagination"
				onChange={(e) => handlePageLimit(e.target.value)}
				className="form-select form-select-sm d-none d-md-block d-lg-block d-xl-block d-xxl-block p-2"
			>
				<option value={1}>1</option>
				<option value={3}>3</option>
				<option value={5}>5</option>
				<option value={10}>10</option>
				<option value={15}>15</option>
				<option value={20}>20</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
				<option value={100}>100</option>
				<option value={250}>250</option>
				<option value={500}>500</option>
				<option value={750}>750</option>
				<option value={1000}>1000</option>
			</select>
		);
	};

	return (
		<nav
			aria-label="Pagination"
			className="pagination-container d-flex align-items-center justify-content-end"
		>
			<ul className="pagination justify-content-end m-0 my-1 mx-1">
				{isAdmin === true && selectLimit()}
				{/* First page */}
				<li className={`page-item ${isFirstPage ? "disabled" : ""}`}>
					<Link
						href={buildHref(1)}
						scroll={false}
						className="page-link"
						aria-label="First page"
					>
						&laquo;&nbsp;First
					</Link>
				</li>

				{/* Previous page */}
				<li className={`page-item ${isFirstPage ? "disabled" : ""}`}>
					<Link
						href={buildHref(Math.max(1, currentPage - 1))}
						className="page-link"
						scroll={false}
						aria-label="Previous page"
					>
						&lsaquo;&nbsp;
					</Link>
				</li>

				{/* Numbered pages & dots */}
				{paginationRange.map((item) => {
					// Dots (ellipsis) — not clickable
					if (typeof item === "string") {
						return (
							<li key={item} className="page-item disabled d-none d-md-block">
								<span className="page-link">&hellip;</span>
							</li>
						);
					}

					// Page number
					return (
						<li
							key={`page-${item}`}
							className={`page-item${
								item === currentPage ? " active" : ""
							} d-none d-md-block d-lg-block d-xl-block d-xxl-block`}
						>
							<Link
								href={buildHref(item)}
								className="page-link"
								scroll={false}
								aria-label={`Page ${item}`}
								aria-current={item === currentPage ? "page" : undefined}
							>
								{item}
							</Link>
						</li>
					);
				})}

				{/* Next page */}
				<li className={`page-item ${isLastPage ? "disabled" : ""}`}>
					<Link
						href={buildHref(Math.min(totalPagesNum, currentPage + 1))}
						className="page-link"
						scroll={false}
						aria-label="Next page"
					>
						&rsaquo;&nbsp;
					</Link>
				</li>

				{/* Last page */}
				<li className={`page-item ${isLastPage ? "disabled" : ""}`}>
					<Link
						href={buildHref(totalPagesNum)}
						className="page-link"
						scroll={false}
						aria-label="Last page"
					>
						&raquo;&nbsp;Last
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default NumericPagination;
