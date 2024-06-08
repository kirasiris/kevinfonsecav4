import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/pages/list";
import { revalidatePath } from "next/cache";

async function getPages(params) {
	const res = await fetchurl(`/pages${params}`, "GET", "no-cache");
	return res;
}

const AdminPagesSearchIndex = async ({ params, searchParams }) => {
	const pages = await getPages(
		`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?keyword=${searchParams.keyword}&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/pages"
				publishedLink="/noadmin/pages/published"
				draftLink="/noadmin/pages/draft"
				scheduledLink="/noadmin/pages/scheduled"
				trashedLink="/noadmin/pages/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/pages"
					pageText="Pages"
					addLink="/noadmin/pages/create"
					searchOn="/noadmin/pages"
					objects={pages}
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

export default AdminPagesSearchIndex;
