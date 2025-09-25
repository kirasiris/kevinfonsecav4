import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/nfabusiness/memberships/list";

async function getMembershipsPublished(params) {
	const res = await fetchurl(`/global/memberships${params}`, "GET", "no-cache");
	return res;
}

const NFAMembershipsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const memberships = await getMembershipsPublished(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const activateIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/memberships/${id}/activateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const disactivateIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/memberships/${id}/disactivateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/memberships/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/memberships/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/nfabusiness/memberships"
				publishedLink="/nfabusiness/memberships/published"
				draftLink="/nfabusiness/memberships/draft"
				scheduledLink="/nfabusiness/memberships/scheduled"
				trashedLink="/nfabusiness/memberships/trashed"
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/nfabusiness/memberships"
					pageText="Memberships"
					addLink="/nfabusiness/memberships/create"
					searchOn="/nfabusiness/memberships"
					objects={memberships}
					searchParams={awtdSearchParams}
					handleDraft={undefined}
					handlePublish={undefined}
					handleTrash={undefined}
					handleSchedule={undefined}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					handleActivate={activateIt}
					handleDisactivate={disactivateIt}
				/>
			</div>
		</>
	);
};

export default NFAMembershipsSearchIndex;
