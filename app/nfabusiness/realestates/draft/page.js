import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/realestates/list";

async function getRealEstates(params) {
	const res = await fetchurl(
		`/global/realestates${params}&postType=realestate&status=draft`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const NFARealEstatesDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const realestates = await getRealEstates(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<NFAStatusesMenu
				allLink="/nfabusiness/realestates"
				publishedLink="/nfabusiness/realestates/published"
				draftLink="/nfabusiness/realestates/draft"
				scheduledLink="/nfabusiness/realestates/scheduled"
				trashedLink="/nfabusiness/realestates/trashed"
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
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/nfabusiness/realestates"
					pageText="Real Estates"
					addLink="/nfabusiness/realestates/create"
					searchOn="/nfabusiness/realestates"
					searchedKeyword=""
					objects={realestates}
					searchParams={awtdSearchParams}
					statusFilter="draft"
					postType="realestate"
				/>
			</div>
		</div>
	);
};

export default NFARealEstatesDraftIndex;
