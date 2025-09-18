import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/nfabusiness/memberships/list";

async function getMembershipsPublished(params) {
	const res = await fetchurl(
		`/extras/stripe/memberships${params}&status=published`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminMembershipsPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const memberships = await getMembershipsPublished(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const activateIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/${id}/activateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/memberships/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const disactivateIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/${id}/disactivateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/memberships/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/memberships/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/memberships/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/memberships/published?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/memberships"
				publishedLink="/noadmin/memberships/published"
				draftLink="/noadmin/memberships/draft"
				scheduledLink="/noadmin/memberships/scheduled"
				trashedLink="/noadmin/memberships/trashed"
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/noadmin/memberships"
					pageText="Memberships"
					addLink="/noadmin/memberships/create"
					searchOn="/noadmin/memberships"
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

export default AdminMembershipsPublishedIndex;
