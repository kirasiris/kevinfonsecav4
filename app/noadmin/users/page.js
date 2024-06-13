import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/users/list";
import { revalidatePath } from "next/cache";

async function getUsers(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	return res;
}

const AdminUsersIndex = async ({ params, searchParams }) => {
	const users = await getUsers(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const assignStripeCustomerId = async (id) => {
		"use server";
		await fetchurl(
			`/extras/stripe/accounts/${id}/assignstripecustomerid`,
			"PUT",
			"no-cache",
			{
				website: "beFree",
			}
		);
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const assignStripeAccountId = async (id) => {
		"use server";
		await fetchurl(
			`/extras/stripe/accounts/${id}/assignstripeaccountid`,
			"PUT",
			"no-cache",
			{
				website: "beFree",
			}
		);
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const assignStripeId = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/accounts/${id}/assignstripeid`,
			"PUT",
			"no-cache",
			{
				website: "beFree",
			}
		);
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const updateStripeSellerAccount = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/accounts/updateseller/${id}`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		await fetchurl(`/users/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/users/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/users/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/users?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/users"
				publishedLink="/noadmin/users/published"
				draftLink="/noadmin/users/draft"
				scheduledLink="/noadmin/users/scheduled"
				trashedLink="/noadmin/users/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/users"
					pageText="Users"
					addLink="/noadmin/users/create"
					searchOn="/noadmin/users"
					objects={users}
					searchParams={searchParams}
					handleDraft={undefined}
					handlePublish={undefined}
					handleTrash={undefined}
					handleSchedule={undefined}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminUsersIndex;
