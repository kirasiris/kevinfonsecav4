import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import List from "@/components/dashboard/companies/list";

async function getCompanies(params) {
	const res = await fetchurl(`/global/companies${params}`, "GET", "no-cache");
	return res;
}

const DashboardCompaniesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const companies = await getCompanies(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/companies/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/companies/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/companies/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/companies/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/companies/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/companies/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/companies/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/companies?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<div className="card rounded-0">
			<List
				stripeChargesEnabled={auth?.userStripeChargesEnabled}
				allLink="/dashboard/companies"
				pageText="Companies"
				addLink="/dashboard/companies/create"
				searchOn="/dashboard/companies"
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
	);
};

export default DashboardCompaniesIndex;
