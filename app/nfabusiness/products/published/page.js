import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/products/list";

async function getProducts(params) {
	const res = await fetchurl(
		`/global/products${params}&postType=product&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const NFAProductsPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const products = await getProducts(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<NFAStatusesMenu
				allLink="/nfabusiness/products"
				publishedLink="/nfabusiness/products/published"
				draftLink="/nfabusiness/products/draft"
				scheduledLink="/nfabusiness/products/scheduled"
				trashedLink="/nfabusiness/products/trashed"
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
					allLink="/nfabusiness/products"
					pageText="Products"
					addLink="/nfabusiness/products/create"
					searchOn="/nfabusiness/products"
					searchedKeyword=""
					objects={products}
					searchParams={awtdSearchParams}
					statusFilter="published"
					postType="product"
				/>
			</div>
		</div>
	);
};

export default NFAProductsPublishedIndex;
