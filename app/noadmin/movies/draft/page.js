import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/movies/list";

async function getPlaylists(params) {
	const res = await fetchurl(
		`/global/playlists${params}&onairtype=movie&status=draft`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminMoviesDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const movies = await getPlaylists(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/movies"
				publishedLink="/noadmin/movies/published"
				draftLink="/noadmin/movies/draft"
				scheduledLink="/noadmin/movies/scheduled"
				trashedLink="/noadmin/movies/trashed"
				filledLink=""
				categoriesLink="/noadmin/movies/categories"
				categoryType="movie"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/movies"
					pageText="Movies"
					addLink="/noadmin/movies/create"
					searchOn="/noadmin/movies"
					searchedKeyword=""
					objects={movies}
					searchParams={awtdSearchParams}
					statusFilter="draft"
					onairType="movie"
				/>
			</div>
		</div>
	);
};

export default AdminMoviesDraftIndex;
