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

const AdminThemeCategoriesIndex = async ({ params, searchParams }) => {
	const categories = await getCategories(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
	);
	const createCategory = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentCategory: formData.get("parentCategory"),
		};
		await fetchurl(`/categories`, "POST", "no-cache", {
			...rawFormData,
			categoryType: "theme",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache", {
			categoryType: "theme",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall/permanently`, "DELETE", "no-cache", {
			categoryType: "theme",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=theme`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/themes"
				publishedLink="/noadmin/themes/published"
				draftLink="/noadmin/themes/draft"
				scheduledLink="/noadmin/themes/scheduled"
				trashedLink="/noadmin/themes/trashed"
				categoriesLink="/noadmin/themes/categories"
				categoryType="theme"
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
							id="text"
							name="text"
							customPlaceholder="Type something..."
							defaultValue=""
							onModel="Category"
							advancedTextEditor={false}
						/>
						<label htmlFor="parent" className="form-label">
							Parent Category
						</label>
						<select
							id="parent"
							name="parent"
							defaultValue=""
							className="form-control"
						>
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
							allLink="/noadmin/themes/categories"
							pageText="Theme Categories"
							addLink="/noadmin/themes/categories"
							searchOn="/noadmin/categories"
							objects={categories}
							searchParams={searchParams}
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

export default AdminThemeCategoriesIndex;
