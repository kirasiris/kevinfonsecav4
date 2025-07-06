import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/dashboard/memberships/list";
import { revalidatePath } from "next/cache";

async function getUserMembershipsEnrolled(params) {
	const res = await fetchurl(
		`/extras/stripe/subscribers${params}&onModel=User`,
		"GET",
		"no-cache"
	);
	return res;
}

const DashboardMembershipsEnrolledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const memberships = await getUserMembershipsEnrolled(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/subscribers/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/subscribers/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/dashboard/memberships/enrolled"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
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
					handleTrashAllFunction={undefined}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default DashboardMembershipsEnrolledIndex;
