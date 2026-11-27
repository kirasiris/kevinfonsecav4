import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateThemeCategoryForm from "@/forms/noadmin/themes/createthemecategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=theme`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminThemeCategoriesIndex = async ({ params, searchParams }) => {
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
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
				filledLink=""
				categoriesLink="/noadmin/themes/categories"
				categoryType="theme"
			/>
			<div className="row">
				<div className="col">
					<CreateThemeCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/themes/categories"
							pageText="Theme Categories"
							addLink="/noadmin/themes/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter=""
							categoryType="theme"
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminThemeCategoriesIndex;
