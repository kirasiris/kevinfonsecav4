import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/courses/list";

async function getCourses(params) {
	const res = await fetchurl(
		`/global/courses${params}&status=draft`,
		"GET",
		"no-cache"
	);
	return res;
}

const NFACoursesDraftIndex = async ({ params, searchParams }) => {
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
		await fetchurl(`/noadmin/stripe/courses/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/courses/${id}/publishit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/courses/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/courses/${id}/scheduleit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/courses/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/courses/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/courses/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/courses/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/courses"
				publishedLink="/nfabusiness/courses/published"
				draftLink="/nfabusiness/courses/draft"
				scheduledLink="/nfabusiness/courses/scheduled"
				trashedLink="/nfabusiness/courses/trashed"
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/nfabusiness/courses"
					pageText="Courses"
					addLink="/nfabusiness/courses/create"
					searchOn="/nfabusiness/courses"
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

export default NFACoursesDraftIndex;
