import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/dashboard/subscribers/list";
import { revalidatePath } from "next/cache";

async function getCoursesEnrolled(params) {
	const res = await fetchurl(
		`/subscribers${params}&onModel=Course`,
		"GET",
		"no-cache"
	);
	return res;
}

const DashboardCoursesEnrolledIndex = async ({ params, searchParams }) => {
	// const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const subscribers = await getCoursesEnrolled(
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
				allLink="/dashboard/courses/enrolled"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/dashboard/courses"
					pageText="Courses"
					addLink="/dashboard/courses/create"
					searchOn="/dashboard/courses"
					objects={subscribers}
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

export default DashboardCoursesEnrolledIndex;
