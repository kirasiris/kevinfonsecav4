import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/dashboard/courses/list";
import { revalidatePath } from "next/cache";

async function getCoursesPublished(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
}

const DashboardCoursesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const courses = await getCoursesPublished(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/dashboard/courses"
				publishedLink="/dashboard/courses/published"
				draftLink="/dashboard/courses/draft"
				scheduledLink="/dashboard/courses/scheduled"
				trashedLink="/dashboard/courses/trashed"
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/dashboard/courses"
					pageText="Courses"
					addLink="/dashboard/courses/create"
					searchOn="/dashboard/courses"
					objects={courses}
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
		</>
	);
};

export default DashboardCoursesIndex;
