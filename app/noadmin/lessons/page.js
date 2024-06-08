import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/lessons/list";
import { revalidatePath } from "next/cache";

async function getLessons(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

const AdminLessonsIndex = async ({ params, searchParams }) => {
	const lessons = await getLessons(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/lessons/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}&onModel=Course`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/lessons"
				publishedLink="/noadmin/lessons/published"
				draftLink="/noadmin/lessons/draft"
				scheduledLink="/noadmin/lessons/scheduled"
				trashedLink="/noadmin/lessons/trashed"
				categoriesLink="/noadmin/lessons/categories"
				categoryType="lesson"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/lessons"
					pageText="Lessons"
					addLink="/noadmin/lessons/create"
					searchOn="/noadmin/lessons"
					objects={lessons}
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

export default AdminLessonsIndex;
