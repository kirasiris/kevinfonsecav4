import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/animes/list";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/global/playlists${params}&onairtype=anime&status=trash`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminAnimesTrashedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const animes = await getPlaylists(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/animes"
				publishedLink="/noadmin/animes/published"
				draftLink="/noadmin/animes/draft"
				scheduledLink="/noadmin/animes/scheduled"
				trashedLink="/noadmin/animes/trashed"
				filledLink=""
				categoriesLink="/noadmin/animes/categories"
				categoryType="anime"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/animes"
					pageText="Animes"
					addLink="/noadmin/animes/create"
					searchOn="/noadmin/animes"
					searchedKeyword=""
					objects={animes}
					searchParams={awtdSearchParams}
					statusFilter="trash"
					onairType="anime"
				/>
			</div>
		</div>
	);
};

export default AdminAnimesTrashedIndex;
