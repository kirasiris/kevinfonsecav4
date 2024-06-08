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

const AdminPageCategoriesIndex = async ({ params, searchParams }) => {
	const categories = await getCategories(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
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
			categoryType: "quiz",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache", {
			categoryType: "quiz",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall/permanently`, "DELETE", "no-cache", {
			categoryType: "quiz",
		});
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&categoryType=quiz`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/quizzes"
				publishedLink="/noadmin/quizzes/published"
				draftLink="/noadmin/quizzes/draft"
				scheduledLink="/noadmin/quizzes/scheduled"
				trashedLink="/noadmin/quizzes/trashed"
				categoriesLink="/noadmin/quizzes/categories"
				categoryType="quiz"
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
							allLink="/noadmin/quizzes/categories"
							pageText="Quizzes Categories"
							addLink="/noadmin/quizzes/categories"
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

export default AdminPageCategoriesIndex;
