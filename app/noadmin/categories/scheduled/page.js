import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateCategoryForm from "@/forms/noadmin/categories/createcategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&status=scheduled`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminCategoriesScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const categories = await getCategories(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/categories"
				publishedLink="/noadmin/categories/published"
				draftLink="/noadmin/categories/draft"
				scheduledLink="/noadmin/categories/scheduled"
				trashedLink="/noadmin/categories/trashed"
				filledLink=""
				categoriesLink="/noadmin/categories"
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<CreateCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/categories"
							pageText="Categories"
							addLink="/noadmin/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter="scheduled"
							categoryType=""
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminCategoriesScheduledIndex;
