import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateMovieCategoryForm from "@/forms/noadmin/movies/createmoviecategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=movie`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminMovieCategoriesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const categories = await getCategories(
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
			<div className="row">
				<div className="col">
					<CreateMovieCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/movies/categories"
							pageText="Movie Categories"
							addLink="/noadmin/movies/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter=""
							categoryType="movie"
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminMovieCategoriesIndex;
