import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/themes/list";

async function getThemes(params) {
	const res = await fetchurl(
		`/global/themes${params}&postType=theme`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminThemesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const themes = await getThemes(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
				filledLink=""
				categoriesLink="/noadmin/themes/categories"
				categoryType="theme"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/themes"
					pageText="Themes"
					addLink="/noadmin/themes/create"
					searchOn="/noadmin/themes"
					searchedKeyword=""
					objects={themes}
					searchParams={awtdSearchParams}
					statusFilter=""
					postType="theme"
				/>
			</div>
		</div>
	);
};

export default AdminThemesIndex;
