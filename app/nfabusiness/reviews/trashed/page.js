import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/reviews/list";

async function getReviews(params) {
	const res = await fetchurl(
		`/global/comments${params}&status=trash&postType=review`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const NFAReviewsTrashedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const reviews = await getReviews(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<NFAStatusesMenu
				allLink="/nfabusiness/reviews"
				publishedLink="/nfabusiness/reviews/published"
				draftLink="/nfabusiness/reviews/draft"
				scheduledLink="/nfabusiness/reviews/scheduled"
				trashedLink="/nfabusiness/reviews/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/reviews"
					pageText="Reviews"
					addLink="/nfabusiness/reviews/create"
					searchOn="/nfabusiness/reviews"
					searchedKeyword=""
					objects={reviews}
					searchParams={awtdSearchParams}
					statusFilter="trash"
					postType="review"
				/>
			</div>
		</div>
	);
};

export default NFAReviewsTrashedIndex;
