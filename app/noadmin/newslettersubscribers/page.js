import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/newslettersubscribers/list";

async function getNewsletterSubscribers(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminNewsletterSubscribersIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const newslettersubscribers = await getNewsletterSubscribers(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/newslettersubscribers"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newslettersubscribers"
					pageText="Newsletter Subscribers"
					addLink=""
					searchOn="/noadmin/newslettersubscribers"
					searchedKeyword=""
					objects={newslettersubscribers}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminNewsletterSubscribersIndex;
