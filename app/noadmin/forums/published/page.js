import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/forums/list";

async function getForums(params) {
	const res = await fetchurl(
		`/global/forums${params}&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminForumsPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const forums = await getForums(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/forums"
				publishedLink="/noadmin/forums/published"
				draftLink="/noadmin/forums/draft"
				scheduledLink="/noadmin/forums/scheduled"
				trashedLink="/noadmin/forums/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/forums"
					pageText="Forums"
					addLink="/noadmin/forums/create"
					searchOn="/noadmin/forums"
					searchedKeyword=""
					objects={forums}
					searchParams={awtdSearchParams}
					statusFilter="published"
				/>
			</div>
		</div>
	);
};

export default AdminForumsPublishedIndex;
