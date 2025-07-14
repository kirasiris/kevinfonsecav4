import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/noadmin/categories/list";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCategoriesScheduledIndex = async ({ params, searchParams }) => {
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
			parentId: formData.get("parentId"),
			deletable: formData.get("deletable"),
		};
		await fetchurl(`/noadmin/categories`, "POST", "no-cache", rawFormData);
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/categories/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/categories/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/categories/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/categories/scheduled?page=${page}&limit=${limit}&sort=${sort}`
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
						<label htmlFor="parentId" className="form-label">
							Parent Category
						</label>
						<select
							id="parentId"
							name="parentId"
							defaultValue=""
							className="form-control mb-3"
						>
							<option value={undefined}>Select category</option>
							{categories?.data?.map((item) => (
								<option key={item._id} value={item._id}>
									{item.title}
								</option>
							))}
						</select>
						<label htmlFor="deletable" className="form-label">
							Deletable
						</label>
						<select
							id="deletable"
							name="deletable"
							defaultValue=""
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
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
							searchedKeyword=""
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

export default AdminCategoriesScheduledIndex;
