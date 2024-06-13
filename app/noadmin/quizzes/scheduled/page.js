import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/quizzes/list";
import { revalidatePath } from "next/cache";

async function getQuizzes(params) {
	const res = await fetchurl(
		`/quizzes${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminQuizzesScheduledIndex = async ({ params, searchParams }) => {
	const quizzes = await getQuizzes(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/quizzes/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/scheduled?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
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
			<div className="card rounded-0">
				<List
					allLink="/noadmin/quizzes"
					pageText="Quizzes"
					addLink="/noadmin/quizzes/create"
					searchOn="/noadmin/quizzes"
					objects={quizzes}
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

export default AdminQuizzesScheduledIndex;
