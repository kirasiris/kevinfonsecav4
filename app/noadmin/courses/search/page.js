import {
	fetchurl,
	getUserStripeChargesEnabled,
} from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/courses/list";
import { revalidatePath } from "next/cache";

async function getCourses(params) {
	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
	return res;
}

const AdminCoursesSearchIndex = async ({ params, searchParams }) => {
	const keyword = searchParams.keyword || "";
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const stripeChargesEnabled = await getUserStripeChargesEnabled();
	const courses = await getCourses(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/courses/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/courses/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/courses"
				publishedLink="/noadmin/courses/published"
				draftLink="/noadmin/courses/draft"
				scheduledLink="/noadmin/courses/scheduled"
				trashedLink="/noadmin/courses/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={stripeChargesEnabled.value}
					allLink="/noadmin/courses"
					pageText="Courses"
					addLink="/noadmin/courses/create"
					searchOn="/noadmin/courses"
					objects={courses}
					searchParams={searchParams}
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

export default AdminCoursesSearchIndex;
