"use client";
import _ from "lodash";

const ClientLoadMorePagination = ({
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
		pageNo = page;
	}

	const handlePageChange = (value) => {
		if (value === "&laquo;") {
			setParams(`?page=1&limit=${limit}${newParams}`);
		} else if (value === "&lsaquo;") {
			if (pageNo !== 1) {
				setParams(`?page=${pageNo - 1}&limit=${limit}${newParams}`);
			}
		} else if (value === "&rsaquo;") {
			if (pageNo !== totalPages)
				setParams(`?page=${pageNo + 1}&limit=${limit}${newParams}`);
		} else if (value === "&raquo;") {
			setParams(`?page=${totalPages}&limit=${limit}${newParams}`);
		} else {
			setParams(`?page=${value}&limit=${limit}${newParams}`);
		}
	};

	return (
		<div className="pagination-container">
			<button className="btn btn-secondary btn-sm justify-content-end m-auto my-1">
				Load more
			</button>
		</div>
	);
};

export default ClientLoadMorePagination;
