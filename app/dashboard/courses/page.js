import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import List from "@/components/dashboard/courses/list";

async function getCourses(params) {
	const res = await fetchurl(`/global/courses${params}`, "GET", "no-cache");
	return res;
}

const DashboardCoursesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const courses = await getCourses(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/${id}/draftit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/${id}/publishit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/${id}/trashit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/${id}/scheduleit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/stripe/courses/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/stripe/courses/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/dashboard/courses?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<div className="card rounded-0">
			<List
				stripeChargesEnabled={auth?.userStripeChargesEnabled}
				allLink="/dashboard/courses"
				pageText="Courses"
				addLink="/dashboard/courses/create"
				searchOn="/dashboard/courses"
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
	);
};

export default DashboardCoursesIndex;
