import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/companies/list";
import { revalidatePath } from "next/cache";

async function getCompanies(params) {
	const res = await fetchurl(`/companies${params}`, "GET", "no-cache");
	return res;
}

const AdminCompaniesSearchIndex = async ({ params, searchParams }) => {
	const keyword = searchParams.keyword || "";
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const companies = await getCompanies(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/companies/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/companies/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/companies"
				publishedLink="/noadmin/companies/published"
				draftLink="/noadmin/companies/draft"
				scheduledLink="/noadmin/companies/scheduled"
				trashedLink="/noadmin/companies/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/companies"
					pageText="Companies"
					addLink="/noadmin/companies/create"
					searchOn="/noadmin/companies"
					objects={companies}
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

export default AdminCompaniesSearchIndex;