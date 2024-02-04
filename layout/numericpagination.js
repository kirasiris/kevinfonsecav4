"use client";
import _ from "lodash";
import Link from "next/link";

const NumericPagination = ({
	totalPages,
	page,
	limit,
	keyword,
	sortby,
	siblings,
	postType = "",
}) => {
	const comesPostType =
		postType !== "" && postType !== undefined ? `&postType=${postType}` : "";
	const myKeyword =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";
	const newParams = `&sort=${sortby}${comesPostType}${myKeyword}`;
	let pageNo;
	if (page <= totalPages) {
		pageNo = page;
	} else {
		// setParams(`?page=${totalPages}&limit=${limit}${newParams}`);
		// router.push(`?page=${totalPages}&limit=${limit}${newParams}`);
		pageNo = page;
	}

	const paginationRange = (siblings) => {
		let totalPagesNoInArray = 7 + siblings;
		if (totalPagesNoInArray >= totalPages) {
			return _.range(1, totalPages + 1);
		}

		let leftSiblingsIndex = Math.max(pageNo - siblings, 1);
		let rightSiblingsIndex = Math.min(pageNo + siblings, totalPages);

		let showLeftDots = leftSiblingsIndex > 2;
		let showRightDots = rightSiblingsIndex < totalPages - 2;

		if (!showLeftDots && showRightDots) {
			let leftItemsCount = 3 + 2 * siblings;
			let leftRange = _.range(1, leftItemsCount + 1);
			return [...leftRange, "...", totalPages];
		} else if (showLeftDots && !showRightDots) {
			let rightItemsCount = 3 + 2 * siblings;
			let rightRange = _.range(
				totalPages - rightItemsCount + 1,
				totalPages + 1
			);
			return [1, "...", ...rightRange];
		} else {
			let middleRange = _.range(leftSiblingsIndex, rightSiblingsIndex + 1);
			return [1, "...", ...middleRange, "...", totalPages];
		}
	};

	let array = paginationRange(siblings);

	return (
		<div className="pagination-container d-flex align-items-center justify-content-end">
			<ul className="pagination justify-content-end m-0 my-1 mx-1">
				<li className="page-item">
					<Link
						href={`?page=1&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&laquo;</a>
					</Link>
				</li>
				<li className="page-item">
					<Link
						href={`?page=${Number(pageNo) - 1}&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&lsaquo;</a>
					</Link>
				</li>

				{array.map((index) => {
					return (
						<li
							key={index}
							className={`page-item ${
								Number(index) === Number(pageNo) ? "active" : ""
							}`}
						>
							{index === "&laquo;" ? (
								<Link
									href={`?page=1&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a className="page-link">{index}</a>
								</Link>
							) : index === "&lsaquo;" ? (
								pageNo !== 1 && (
									<Link
										href={`?page=${pageNo - 1}&limit=${limit}${newParams}`}
										passHref
										legacyBehavior
									>
										<a className="page-link">{index}</a>
									</Link>
								)
							) : index === "&rsaquo;" ? (
								pageNo !== totalPages && (
									<Link
										href={`?page=${pageNo + 1}&limit=${limit}${newParams}`}
										passHref
										legacyBehavior
									>
										<a className="page-link">{index}</a>
									</Link>
								)
							) : index === "&raquo;" ? (
								<Link
									href={`?page=${totalPages}&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a className="page-link">{index}</a>
								</Link>
							) : (
								<Link
									href={`?page=${index}&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a className="page-link">{index}</a>
								</Link>
							)}
						</li>
					);
				})}
				<li className="page-item">
					<Link
						href={`?page=${Number(pageNo) + 1}&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&rsaquo;</a>
					</Link>
				</li>
				<li className="page-item">
					<Link
						href={`?page=${totalPages}&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&raquo;</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default NumericPagination;
