import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateBlogCategoryForm from "@/forms/noadmin/blogs/createblogcategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=blog`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminBlogCategoriesIndex = async ({ params, searchParams }) => {
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
				allLink="/noadmin/blogs"
				publishedLink="/noadmin/blogs/published"
				draftLink="/noadmin/blogs/draft"
				scheduledLink="/noadmin/blogs/scheduled"
				trashedLink="/noadmin/blogs/trashed"
				filledLink=""
				categoriesLink="/noadmin/blogs/categories"
				categoryType="blog"
			/>
			<div className="row">
				<div className="col">
					<CreateBlogCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/blogs/categories"
							pageText="Blog Categories"
							addLink="/noadmin/blogs/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter=""
							categoryType="blog"
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminBlogCategoriesIndex;
