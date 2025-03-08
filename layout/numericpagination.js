"use client";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NumericPagination = ({
	totalPages,
	searchParams = {},
	siblings,
	isAdmin = true,
}) => {
	const keyword = searchParams.keyword;
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt || "";
	const random = searchParams.random || "";
	const email = searchParams.email || "";
	const posttype = searchParams.postType || "";

	// Initialize router
	const router = useRouter();

	// If query postType is found
	const postTypeQuery =
		posttype !== "" && posttype !== undefined ? `&postType=${posttype}` : "";
	// If query keyword is found
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";
	// If query decrypt is found
	const decryptQuery = decrypt === "true" ? "&decrypt=true" : "";
	// If query random is found
	const randomQuery = random === "true" ? "&random=true" : "";
	// If query email is found
	const emailQuery = email ? `&email=${email}` : "";
	// Add them all together
	const newParams = `&sort=${sort}${postTypeQuery}${keywordQuery}${randomQuery}${decryptQuery}${emailQuery}`;
	let pageNo;
	if (page <= Number(totalPages)) {
		pageNo = page;
	} else {
		pageNo = page;
	}

	const paginationRange = (siblings) => {
		let totalPagesNoInArray = 7 + Number(siblings);
		if (totalPagesNoInArray >= Number(totalPages)) {
			return _.range(1, Number(totalPages) + 1);
		}

		let leftSiblingsIndex = Math.max(pageNo - Number(siblings), 1);
		let rightSiblingsIndex = Math.min(
			pageNo + Number(siblings),
			Number(totalPages)
		);

		let showLeftDots = leftSiblingsIndex > 2;
		let showRightDots = rightSiblingsIndex < Number(totalPages) - 2;

		if (!showLeftDots && showRightDots) {
			let leftItemsCount = 3 + 2 * Number(siblings);
			let leftRange = _.range(1, leftItemsCount + 1);
			return [...leftRange, "...", Number(totalPages)];
		} else if (showLeftDots && !showRightDots) {
			let rightItemsCount = 3 + 2 * Number(siblings);
			let rightRange = _.range(
				Number(totalPages) - rightItemsCount + 1,
				Number(totalPages) + 1
			);
			return [1, "...", ...rightRange];
		} else {
			let middleRange = _.range(leftSiblingsIndex, rightSiblingsIndex + 1);
			return [1, "...", ...middleRange, "...", Number(totalPages)];
		}
	};

	let array = paginationRange(siblings);

	const handlePageLimit = (value) => {
		router.push(`?page=${Number(pageNo)}&limit=${Number(value)}${newParams}`);
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
				<li className={`page-item ${Number(pageNo) - 1 === 0 && `disabled`}`}>
					<Link
						href={`?page=1&limit=${Number(limit)}${newParams}`}
						passHref
						legacyBehavior
						scroll={false}
					>
						<a className="page-link">&laquo;&nbsp;First</a>
					</Link>
				</li>
				{/* Previous page link */}
				<li className={`page-item ${Number(pageNo) - 1 === 0 && `disabled`}`}>
					<Link
						href={`?page=${Number(pageNo) - 1}&limit=${Number(
							limit
						)}${newParams}`}
						passHref
						legacyBehavior
						scroll={false}
					>
						<a className="page-link">&lsaquo;&nbsp;</a>
					</Link>
				</li>
				{array.map((index) => {
					return (
						<li
							key={index}
							className={`page-item${
								Number(index) === Number(pageNo) ? " active" : ""
							} d-none d-md-block d-lg-block d-xl-block d-xxl-block`}
						>
							{index === "&laquo;" ? (
								<Link
									href={`?page=1&limit=${Number(limit)}${newParams}`}
									passHref
									legacyBehavior
									scroll={false}
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
										href={`?page=${Number(pageNo) - 1}&limit=${Number(
											limit
										)}${newParams}`}
										passHref
										legacyBehavior
										scroll={false}
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
										href={`?page=${Number(pageNo) + 1}&limit=${Number(
											limit
										)}${newParams}`}
										passHref
										legacyBehavior
										scroll={false}
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
									href={`?page=${Number(totalPages)}&limit=${Number(
										limit
									)}${newParams}`}
									passHref
									legacyBehavior
									scroll={false}
								>
									<a
										className={`page-link${index === "..." ? " disabled" : ""}`}
									>
										{index}
									</a>
								</Link>
							) : (
								<Link
									href={`?page=${index}&limit=${Number(limit)}${newParams}`}
									passHref
									legacyBehavior
									scroll={false}
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
				{/* Next page link */}
				<li
					className={`page-item ${
						Number(pageNo) === Number(totalPages) && "disabled"
					}`}
				>
					<Link
						href={`?page=${Number(pageNo) + 1}&limit=${Number(
							limit
						)}${newParams}`}
						passHref
						legacyBehavior
						scroll={false}
					>
						<a className="page-link">&rsaquo;&nbsp;</a>
					</Link>
				</li>
				<li
					className={`page-item ${
						Number(pageNo) === Number(totalPages) && "disabled"
					}`}
				>
					<Link
						href={`?page=${Number(totalPages)}&limit=${Number(
							limit
						)}${newParams}`}
						passHref
						legacyBehavior
						scroll={false}
					>
						<a className="page-link">&raquo;&nbsp;Last</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default NumericPagination;
