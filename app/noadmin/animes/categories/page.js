import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateAnimeCategoryForm from "@/forms/noadmin/animes/createanimecategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=anime`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminAnimeCategoriesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const categories = await getCategories(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
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
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/deleteall`, "PUT", "no-cache", {
			categoryType: "anime",
		});
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/categories/deleteall/permanently`,
			"DELETE",
			"no-cache",
			{
				categoryType: "anime",
			},
		);
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const usageCountIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/usagecount`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const usageCountItAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/allusagecount`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/animes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/animes"
				publishedLink="/noadmin/animes/published"
				draftLink="/noadmin/animes/draft"
				scheduledLink="/noadmin/animes/scheduled"
				trashedLink="/noadmin/animes/trashed"
				categoriesLink="/noadmin/animes/categories"
				categoryType="anime"
			/>
			<div className="row">
				<div className="col">
					<CreateAnimeCategoryForm
						page={page}
						limit={limit}
						sort={sort}
						objects={categories}
					/>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/animes/categories"
							pageText="Anime Categories"
							addLink="/noadmin/animes/categories"
							searchOn="/noadmin/categories"
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

export default AdminAnimeCategoriesIndex;
