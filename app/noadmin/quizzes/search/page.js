import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/quizzes/list";

async function getQuizzes(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	return res;
}

const AdminQuizzesSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const quizzes = await getQuizzes(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quizzes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/quizzes/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/quizzes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
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
					searchedKeyword={keyword}
					objects={quizzes}
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
		</>
	);
};

export default AdminQuizzesSearchIndex;
