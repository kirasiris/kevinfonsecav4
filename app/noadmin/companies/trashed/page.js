import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/companies/list";

async function getCompanies(params) {
	const res = await fetchurl(
		`/global/companies${params}&status=trash`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCompaniesTrashedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const companies = await getCompanies(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/companies/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/companies/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/companies/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/companies/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/companies/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/companies/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/companies/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/companies/trashed?page=${page}&limit=${limit}&sort=${sort}`
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
					searchedKeyword=""
					objects={companies}
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

export default AdminCompaniesTrashedIndex;
