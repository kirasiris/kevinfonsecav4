"use client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NumericPagination = ({
	totalPages,
	page = 1,
	limit = 10,
	keyword,
	sortby = `-createdAt`,
	decrypt = false,
	siblings,
	postType = "",
	isAdmin = true,
}) => {
	const router = useRouter();
	// If query postType is found
	const comesPostType =
		postType !== "" && postType !== undefined ? `&postType=${postType}` : "";
	// If query keyword is found
	const myKeyword =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";
	// If query decrypt is found
	const myDecrypt = decrypt ? "&decrypt=true" : "";
	// Add them all together
	const newParams = `&sort=${sortby}${comesPostType}${myKeyword}${myDecrypt}`;
	let pageNo;
	if (page <= totalPages) {
		pageNo = page;
	} else {
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

	const handlePageLimit = (value) => {
		router.push(`?page=${pageNo}&limit=${value}${newParams}`);
	};

	const selectLimit = () => {
		return (
			<select
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
		<div className="pagination-container d-flex align-items-center justify-content-end">
			{isAdmin && selectLimit()}
			<ul className="pagination justify-content-end m-0 my-1 mx-1">
				<li className="page-item">
					<Link
						href={`?page=1&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&laquo;&nbsp;First</a>
					</Link>
				</li>
				<li className="page-item">
					<Link
						href={`?page=${Number(pageNo) - 1}&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&lsaquo;&nbsp;Previous</a>
					</Link>
				</li>

				{array.map((index) => {
					return (
						<li
							key={index}
							className={`page-item${
								Number(index) === Number(pageNo) ? " active" : ""
							}`}
						>
							{index === "&laquo;" ? (
								<Link
									href={`?page=1&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a
										className={`page-link${index === "..." ? " disabled" : ""}`}
									>
										{index}
									</a>
								</Link>
							) : index === "&lsaquo;" ? (
								pageNo !== 1 && (
									<Link
										href={`?page=${pageNo - 1}&limit=${limit}${newParams}`}
										passHref
										legacyBehavior
									>
										<a
											className={`page-link${
												index === "..." ? " disabled" : ""
											}`}
										>
											{index}
										</a>
									</Link>
								)
							) : index === "&rsaquo;" ? (
								pageNo !== totalPages && (
									<Link
										href={`?page=${pageNo + 1}&limit=${limit}${newParams}`}
										passHref
										legacyBehavior
									>
										<a
											className={`page-link${
												index === "..." ? " disabled" : ""
											}`}
										>
											{index}
										</a>
									</Link>
								)
							) : index === "&raquo;" ? (
								<Link
									href={`?page=${totalPages}&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a
										className={`page-link${index === "..." ? " disabled" : ""}`}
									>
										{index}
									</a>
								</Link>
							) : (
								<Link
									href={`?page=${index}&limit=${limit}${newParams}`}
									passHref
									legacyBehavior
								>
									<a
										className={`page-link${index === "..." ? " disabled" : ""}`}
									>
										{index}
									</a>
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
						<a className="page-link">&rsaquo;&nbsp;Next</a>
					</Link>
				</li>
				<li className="page-item">
					<Link
						href={`?page=${totalPages}&limit=${limit}${newParams}`}
						passHref
						legacyBehavior
					>
						<a className="page-link">&raquo;&nbsp;Last</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default NumericPagination;
