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

const AdminMembershipsSearchIndex = async ({ params, searchParams }) => {
	const keyword = searchParams.keyword || "";
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const stripeChargesEnabled = await getUserStripeChargesEnabled();
	const memberships = await getMembershipsPublished(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/memberships/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
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

export default AdminMembershipsSearchIndex;