import {
	fetchurl,
	getUserIdOnServer,
	getUserStripeChargesEnabled,
} from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/dashboard/memberships/list";
import { revalidatePath } from "next/cache";

const userId = await getUserIdOnServer();

async function getMembershipsPublished(params) {
	const res = await fetchurl(
		`/courses?user=${userId.value}${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const DashboardMembershipsIndex = async ({ params, searchParams }) => {
	const stripeChargesEnabled = await getUserStripeChargesEnabled();
	const memberships = await getMembershipsPublished(
		`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

	const activateIt = async (formData) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/${id}/activateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath();
	};

	const disactivateIt = async (formData) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/memberships/${id}/disactivateit`,
			"PUT",
			"no-cache"
		);
		revalidatePath();
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
			`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/dashboard/memberships"
				publishedLink="/dashboard/memberships/published"
				draftLink="/dashboard/memberships/draft"
				scheduledLink="/dashboard/memberships/scheduled"
				trashedLink="/dashboard/memberships/trashed"
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={stripeChargesEnabled.value}
					allLink="/dashboard/memberships"
					pageText="Memberships"
					addLink="/dashboard/memberships/create"
					searchOn="/dashboard/memberships"
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

export default DashboardMembershipsIndex;
