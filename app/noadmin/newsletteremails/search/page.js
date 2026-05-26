import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/newsletteremails/list";

async function getNewsletterEmails(params) {
	const res = await fetchurl(
		`/global/newsletteremails${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminNewsletterEmailsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const newsletteremails = await getNewsletterEmails(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/${id}/draftit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/${id}/publishit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/${id}/trashit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/${id}/scheduleit`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/newsletteremails/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newsletteremails/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newsletteremails/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/newsletteremails"
				publishedLink="/noadmin/newsletteremails/published"
				draftLink="/noadmin/newsletteremails/draft"
				scheduledLink="/noadmin/newsletteremails/scheduled"
				trashedLink="/noadmin/newsletteremails/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newsletteremails"
					pageText="Newsletter Emails"
					addLink="/noadmin/newsletteremails/create"
					searchOn="/noadmin/newsletteremails"
					searchedKeyword={keyword}
					objects={newsletteremails}
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

export default AdminNewsletterEmailsSearchIndex;
