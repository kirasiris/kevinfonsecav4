import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/users/list";

async function getUsers(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const AdminUsersSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const users = await getUsers(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const assignStripeCustomerId = async (id) => {
		"use server";
		await fetchurl(
			`/noadmin/stripe/accounts/${id}/assignstripecustomerid`,
			"PUT",
			"no-cache",
			{
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const assignStripeAccountId = async (id) => {
		"use server";
		await fetchurl(
			`/noadmin/stripe/accounts/${id}/assignstripeaccountid`,
			"PUT",
			"no-cache",
			{
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const assignStripeId = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/accounts/${id}/assignstripeid`,
			"PUT",
			"no-cache",
			{
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const updateStripeSellerAccount = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/accounts/updateseller/${id}`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const assignStripeOnBoardingLink = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/accounts/${id}/assignstripeonboardinglink`,
			"PUT",
			"no-cache",
			{
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleAssignReferralCode = async (id) => {
		"use server";
		await fetchurl(
			`/noadmin/users/${id}/assignreferralcode`,
			"PUT",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		await fetchurl(`/noadmin/users/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/users/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/users/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/users"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/users"
					pageText="Users"
					addLink="/noadmin/users/create"
					searchOn="/noadmin/users"
					searchedKeyword={keyword}
					objects={users}
					searchParams={awtdSearchParams}
					handleAssignStripeCustomerId={assignStripeCustomerId}
					handleAssignStripeAccountId={assignStripeAccountId}
					handleAssignStripeId={assignStripeId}
					handleUpdateStripeSellerAccount={updateStripeSellerAccount}
					handleAssignStripeOnBoardingLink={assignStripeOnBoardingLink}
					handleAssignReferralCode={handleAssignReferralCode}
					handleDelete={handleDelete}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminUsersSearchIndex;
