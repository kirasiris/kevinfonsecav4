import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/admin/categories/list";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCategory = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const category = await getCategories(`/${params.id}`);

	const categories = await getCategories(
		`?page=${awtdSearchParams.page || 1}&limit=${
			awtdSearchParams.limit || 10
		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	);
	const upgradeCategory = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentCategory: formData.get("parentCategory"),
		};
		await fetchurl(`/categories/${params.id}`, "PUT", "no-cache", rawFormData);
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache", {});
		revalidatePath(
			`/noadmin/categories?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/categories/deleteall/permanently`,
			"DELETE",
			"no-cache",
			{}
		);
		revalidatePath(
			`/noadmin/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
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
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<form action={upgradeCategory}>
						<label htmlFor="category-title" className="form-label">
							Title
						</label>
						<input
							id="category-title"
							name="title"
							defaultValue={category?.data?.title}
							type="text"
							className="form-control mb-3"
							placeholder="Untitled"
						/>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
							auth={undefined}
							id="text"
							name="text"
							customPlaceholder="Type something..."
							defaultValue={category?.data?.text}
							onModel="Category"
							advancedTextEditor={false}
						/>
						<label htmlFor="parent" className="form-label">
							Parent Category
						</label>
						<select
							id="parent"
							name="parent"
							defaultValue={category?.data?.parentCategory}
							className="form-control"
						>
							<option value="">Select category</option>
							{categories?.data?.map((item) => (
								<option key={item._id} value={item._id}>
									{item.title}
								</option>
							))}
						</select>
						<br />
						<FormButtons />
					</form>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/categories"
							pageText="Categories"
							addLink="/noadmin/categories"
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
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpdateCategory;
