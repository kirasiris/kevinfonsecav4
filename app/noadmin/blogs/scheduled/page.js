import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/blogs/list";
import { revalidatePath } from "next/cache";

async function getBlogs(params) {
	const res = await fetchurl(`/blogs${params}`, "GET", "no-cache");
	return res;
}

const AdminBlogsScheduledIndex = async ({ params, searchParams }) => {
	const blogs = await getBlogs(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&postType=blog&status=scheduled`
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
					objects={blogs}
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
		</>
	);
};

export default AdminBlogsScheduledIndex;
