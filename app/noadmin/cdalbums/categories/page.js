import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/admin/categories/list";
import { revalidatePath } from "next/cache";

async function getCategories(params) {
	const res = await fetchurl(
		`/categories${params}&categoryType=album`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCDAlbumCategoriesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const categories = await getCategories(
		`?page=${page}&limit=${limit}&sort=${sort}`
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
			categoryType: "album",
		});
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache", {
			categoryType: "album",
		});
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall/permanently`, "DELETE", "no-cache", {
			categoryType: "album",
		});
		revalidatePath(
			`/noadmin/cdalbums/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/cdalbums"
				publishedLink="/noadmin/cdalbums/published"
				draftLink="/noadmin/cdalbums/draft"
				scheduledLink="/noadmin/cdalbums/scheduled"
				trashedLink="/noadmin/cdalbums/trashed"
				categoriesLink="/noadmin/cdalbums/categories"
				categoryType="song"
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
						<label htmlFor="parent" className="form-label">
							Parent Category
						</label>
						<select
							id="parent"
							name="parent"
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
							allLink="/noadmin/cdalbums/categories"
							pageText="CD Albums Genres"
							addLink="/noadmin/cdalbums/categories"
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

export default AdminCDAlbumCategoriesIndex;
