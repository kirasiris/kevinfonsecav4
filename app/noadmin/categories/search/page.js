import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/admin/categories/list";
import { revalidatePath } from "next/cache";

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const AdminCategoriesSearchIndex = async ({ params, searchParams }) => {
	const categories = await getCategories(
		`?keyword=${searchParams.keyword}&page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=${searchParams.sort || "-createdAt"}`
	);
	const createCategory = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentCategory: formData.get("parentCategory"),
		};
		await fetchurl(`/categories`, "POST", "no-cache", rawFormData);
		revalidatePath(
			`/noadmin/categories/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/categories/search?keyword=${searchParams.keyword}&page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 10}&sort=${
				searchParams.sort || "-createdAt"
			}`
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
					<form action={createCategory}>
						<label htmlFor="category-title" className="form-label">
							Title
						</label>
						<input
							id="category-title"
							name="title"
							defaultValue=""
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
							defaultValue=""
							onModel="Category"
							advancedTextEditor={false}
						/>
						<label htmlFor="parentCategory" className="form-label">
							Parent Category
						</label>
						<select
							id="parentCategory"
							name="parentCategory"
							defaultValue=""
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
							searchParams={searchParams}
							handleDraft={undefined}
							handlePublish={undefined}
							handleTrash={undefined}
							handleSchedule={undefined}
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

export default AdminCategoriesSearchIndex;
