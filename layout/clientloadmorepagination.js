"use client";
import _ from "lodash";

const ClientLoadMorePagination = ({
	limit,
	next,
	sortby,
	setParams,
	postType = "",
	router,
	classList = "",
}) => {
	const toSkip = Number(0) + Number(limit);
	const comesPostType = postType !== "" ? `&postType=${postType}` : "";
	const newParams = `&sort=${sortby}${comesPostType}`;

	const loadMore = () => {
		setParams(`?page=${next}&limit=${limit}&skip=${toSkip}${newParams}`);
	};

	return (
		<div className={`pagination-container ${classList}`}>
			<button
				onClick={loadMore}
				className="btn btn-secondary btn-sm justify-content-end m-auto my-1"
			>
				Load more
			</button>
		</div>
	);
};

export default ClientLoadMorePagination;
