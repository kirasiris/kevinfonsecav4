import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import UpdateCategoryForm from "@/forms/noadmin/categories/updatecategoryform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const UpdateCategory = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const [category, categories] = await Promise.all([
		getCategories(`/${awtdParams.id}`),
		getCategories(`?page=${page}&limit=${limit}&sort=${sort}`),
	]);

	if (!category?.success) {
		notFound();
	}

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/categories"
				publishedLink="/noadmin/categories/published"
				draftLink="/noadmin/categories/draft"
				scheduledLink="/noadmin/categories/scheduled"
				trashedLink="/noadmin/categories/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<UpdateCategoryForm
						currentpage={`/noadmin/categories?page=${page}&limit=${limit}&sort=${sort}`}
						object={category}
						objects={categories}
					/>
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
							// statusFilter=""
							// categoryType=""
							// handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpdateCategory;
