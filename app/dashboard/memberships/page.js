import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/dashboard/memberships/list";
import { revalidatePath } from "next/cache";

async function getMembershipsPublished(params) {
	const res = await fetchurl(
		`/extras/stripe/courses${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const DashboardMembershipsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const memberships = await getMembershipsPublished(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
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
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/memberships/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
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
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
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
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/dashboard/memberships"
					pageText="Memberships"
					addLink="/dashboard/memberships/create"
					searchOn="/dashboard/memberships"
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

export default DashboardMembershipsIndex;
