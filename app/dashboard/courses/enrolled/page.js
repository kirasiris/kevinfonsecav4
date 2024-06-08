import { fetchurl, getUserIdOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/dashboard/subscribers/list";
import { revalidatePath } from "next/cache";

const userId = await getUserIdOnServer();

async function getCoursesEnrolled(params) {
	const res = await fetchurl(
		`/subscribers?user=${userId.value}&onModel=Course${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const DashboardCoursesEnrolledIndex = async ({ params, searchParams }) => {
	const subscribers = await getCoursesEnrolled(
		`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/subscribers/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/subscribers/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`&page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
					searchParams={searchParams}
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
