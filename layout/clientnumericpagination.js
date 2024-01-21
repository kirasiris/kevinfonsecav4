"use client";
import _ from "lodash";

const ClientNumericPagination = ({
	totalPages,
	page,
	limit,
	sortby,
	siblings,
	setParams,
	postType = "",
	router,
}) => {
	const comesPostType = postType !== "" ? `&postType=${postType}` : "";
	const newParams = `&sort=${sortby}${comesPostType}`;
	let pageNo;
	if (page <= totalPages) {
		pageNo = page;
	} else {
		setParams(`?page=${totalPages}&limit=${limit}${newParams}`);
		router.push(`?page=${totalPages}&limit=${limit}${newParams}`);

		pageNo = page;
	}

	const handlePageChange = (value) => {
		if (value === "&laquo;") {
			setParams(`?page=1&limit=${limit}${newParams}`);
			router.push(`?page=1&limit=${limit}${newParams}`);
		} else if (value === "&lsaquo;") {
			if (pageNo !== 1) {
				setParams(`?page=${pageNo - 1}&limit=${limit}${newParams}`);
				router.push(`?page=${pageNo - 1}&limit=${limit}${newParams}`);
			}
		} else if (value === "&rsaquo;") {
			if (pageNo !== totalPages)
				setParams(`?page=${pageNo + 1}&limit=${limit}${newParams}`);
			router.push(`?page=${pageNo + 1}&limit=${limit}${newParams}`);
		} else if (value === "&raquo;") {
			setParams(`?page=${totalPages}&limit=${limit}${newParams}`);
			router.push(`?page=${totalPages}&limit=${limit}${newParams}`);
		} else {
			setParams(`?page=${value}&limit=${limit}${newParams}`);
			router.push(`?page=${value}&limit=${limit}${newParams}`);
		}
	};

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
		setParams(`?page=${pageNo}&limit=${value}${newParams}`);
		router.push(`?page=${pageNo}&limit=${value}${newParams}`);
	};

	const selectLimit = () => {
		return (
			<select
				onChange={(e) => handlePageLimit(e.target.value)}
				className="form-select form-select-sm d-none d-md-block d-lg-block d-xl-block d-xxl-block"
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
			{selectLimit()}
			<ul className="pagination justify-content-end m-0 my-1 mx-1">
				<li className="page-item">
					<span
						onClick={() => handlePageChange("&laquo;")}
						className="page-link"
					>
						&laquo;
					</span>
				</li>
				<li className="page-item">
					<span
						onClick={() => handlePageChange("&lsaquo;")}
						className="page-link"
					>
						&lsaquo;
					</span>
				</li>
				{array.map((index) => {
					return (
						<li
							key={index}
							className={`page-item ${index === pageNo ? "active" : ""}`}
						>
							<span
								onClick={() => handlePageChange(index)}
								className="page-link"
							>
								{index}
							</span>
						</li>
					);
				})}
				<li className="page-item">
					<span
						onClick={() => handlePageChange("&rsaquo;")}
						className="page-link"
					>
						&rsaquo;
					</span>
				</li>
				<li className="page-item">
					<span
						onClick={() => handlePageChange("&raquo;")}
						className="page-link"
					>
						&raquo;
					</span>
				</li>
			</ul>
		</div>
	);
};

export default ClientNumericPagination;
