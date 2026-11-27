import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/cdalbums/list";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/global/playlists${params}&onairtype=cd-album&status=trash`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminCDAlbumsTrashedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const cdalbums = await getPlaylists(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/cdalbums"
				publishedLink="/noadmin/cdalbums/published"
				draftLink="/noadmin/cdalbums/draft"
				scheduledLink="/noadmin/cdalbums/scheduled"
				trashedLink="/noadmin/cdalbums/trashed"
				filledLink=""
				categoriesLink="/noadmin/cdalbums/categories"
				categoryType="album"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/cdalbums"
					pageText="CD Albums"
					addLink="/noadmin/cdalbums/create"
					searchOn="/noadmin/cdalbums"
					searchedKeyword=""
					objects={cdalbums}
					searchParams={awtdSearchParams}
					statusFilter="trash"
					onairType="cd-album"
				/>
			</div>
		</div>
	);
};

export default AdminCDAlbumsTrashedIndex;
