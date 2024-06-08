import {
	fetchurl,
	getUserStripeChargesEnabled,
} from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/memberships/list";
import { revalidatePath } from "next/cache";

async function getMembershipsPublished(params) {
	const res = await fetchurl(
		`/extras/stripe/memberships${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminMembershipsIndex = async ({ params, searchParams }) => {
	const stripeChargesEnabled = await getUserStripeChargesEnabled();
	const memberships = await getMembershipsPublished(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
					stripeChargesEnabled={stripeChargesEnabled.value}
					allLink="/noadmin/memberships"
					pageText="Memberships"
					addLink="/noadmin/memberships/create"
					searchOn="/noadmin/memberships"
					objects={memberships}
					searchParams={searchParams}
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

export default AdminMembershipsIndex;
