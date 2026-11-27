import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateCDAlbumCategoryForm from "@/forms/noadmin/cdalbums/createcdalbumcategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=album`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminCDAlbumCategoriesIndex = async ({ params, searchParams }) => {
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
				allLink="/noadmin/cdalbums"
				publishedLink="/noadmin/cdalbums/published"
				draftLink="/noadmin/cdalbums/draft"
				scheduledLink="/noadmin/cdalbums/scheduled"
				trashedLink="/noadmin/cdalbums/trashed"
				filledLink=""
				categoriesLink="/noadmin/cdalbums/categories"
				categoryType="album"
			/>
			<div className="row">
				<div className="col">
					<CreateCDAlbumCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/cdalbums/categories"
							pageText="CD Albums Genres"
							addLink="/noadmin/cdalbums/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter=""
							categoryType="album"
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminCDAlbumCategoriesIndex;
