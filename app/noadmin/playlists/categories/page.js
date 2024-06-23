import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/admin/categories/list";
import { revalidatePath } from "next/cache";

async function getCategories(params) {
	const res = await fetchurl(
		`/categories${params}&categoryType=playlist`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminPlaylistCategoriesIndex = async ({ params, searchParams }) => {
	const categories = await getCategories(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
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
			categoryType: "playlist",
		});
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall`, "PUT", "no-cache", {
			categoryType: "playlist",
		});
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/categories/deleteall/permanently`, "DELETE", "no-cache", {
			categoryType: "playlist",
		});
		revalidatePath(
			`/noadmin/playlists/categories?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/playlists"
				publishedLink="/noadmin/playlists/published"
				draftLink="/noadmin/playlists/draft"
				scheduledLink="/noadmin/playlists/scheduled"
				trashedLink="/noadmin/playlists/trashed"
				categoriesLink="/noadmin/playlists/categories"
				categoryType="playlist"
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
						<label htmlFor="parentCategory" className="form-label">
							Parent Category
						</label>
						<select
							id="parentCategory"
							name="parentCategory"
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
							allLink="/noadmin/playlists/categories"
							pageText="Playlist Categories"
							addLink="/noadmin/playlists/categories"
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

export default AdminPlaylistCategoriesIndex;
