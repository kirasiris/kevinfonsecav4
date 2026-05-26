import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/blogs/list";

async function getBlogs(params) {
	const res = await fetchurl(
		`/global/blogs${params}&postType=blog`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminBlogsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const blogs = await getBlogs(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/blogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/blogs/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/blogs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/blogs"
				publishedLink="/noadmin/blogs/published"
				draftLink="/noadmin/blogs/draft"
				scheduledLink="/noadmin/blogs/scheduled"
				trashedLink="/noadmin/blogs/trashed"
				categoriesLink="/noadmin/blogs/categories"
				categoryType="blog"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/blogs"
					pageText="Blogs"
					addLink="/noadmin/blogs/create"
					searchOn="/noadmin/blogs"
					searchedKeyword={keyword}
					objects={blogs}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
					handleTrash={trashIt}
					handleSchedule={scheduleIt}
					handleFeature={featureIt}
					handleUnfeature={unfeatureIt}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminBlogsSearchIndex;
