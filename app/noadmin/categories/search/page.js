import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateCategoryForm from "@/forms/noadmin/categories/createcategoryform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const AdminCategoriesSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const categories = await getCategories(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/categories/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/categories/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const usageCountIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/usagecount`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const usageCountItAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/allusagecount`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/categories"
				publishedLink="/noadmin/categories/published"
				draftLink="/noadmin/categories/draft"
				scheduledLink="/noadmin/categories/scheduled"
				trashedLink="/noadmin/categories/trashed"
			/>
			<div className="row">
				<div className="col">
					<CreateCategoryForm
						currentpage={`/noadmin/categories/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`}
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
							searchedKeyword={keyword}
							objects={categories}
							searchParams={awtdSearchParams}
							handleDraft={draftIt}
							handlePublish={publishIt}
							handleTrash={trashIt}
							handleSchedule={scheduleIt}
							handleDelete={handleDelete}
							handleTrashAllFunction={handleTrashAll}
							handleDeleteAllFunction={handleDeleteAll}
							handleUsageCount={usageCountIt}
							handleAllUsageCountEnabled={true}
							handleAllUsageCount={usageCountItAll}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminCategoriesSearchIndex;
