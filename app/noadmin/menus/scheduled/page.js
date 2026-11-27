import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/menus/list";

async function getMenus(params) {
	const res = await fetchurl(
		`/global/menus${params}&status=scheduled`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminMenusScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const menus = await getMenus(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/menus"
				publishedLink="/noadmin/menus/published"
				draftLink="/noadmin/menus/draft"
				scheduledLink="/noadmin/menus/scheduled"
				trashedLink="/noadmin/menus/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/menus"
					pageText="Menus"
					addLink="/noadmin/menus/create"
					searchOn="/noadmin/menus"
					searchedKeyword=""
					objects={menus}
					searchParams={awtdSearchParams}
					statusFilter="scheduled"
				/>
			</div>
		</div>
	);
};

export default AdminMenusScheduledIndex;
