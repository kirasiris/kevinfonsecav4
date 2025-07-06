import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/courses/list";

async function getCourses(params) {
	const res = await fetchurl(
		`/extras/stripe/courses${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminCoursesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const courses = await getCourses(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/courses/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/courses/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/courses/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/courses/${id}/scheduleit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/courses/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/stripe/courses/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/stripe/courses/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/courses?page=${page}&limit=${limit}&sort=${sort}`);
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
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/noadmin/courses"
					pageText="Courses"
					addLink="/noadmin/courses/create"
					searchOn="/noadmin/courses"
					searchedKeyword=""
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

export default AdminCoursesIndex;
