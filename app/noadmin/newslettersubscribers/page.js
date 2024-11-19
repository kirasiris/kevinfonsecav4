import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/newslettersubscribers/list";
import { revalidatePath } from "next/cache";

async function getNewsletterSubscribers(params) {
	const res = await fetchurl(
		`/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminNewsletterSubscribersIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const newslettersubscribers = await getNewsletterSubscribers(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	// const draftIt = async (id) => {
	// 	"use server";
	// 	// const rawFormData = {}
	// 	await fetchurl(`/newslettersubscribers/${id}/draftit`, "PUT", "no-cache");
	// 	revalidatePath(
	// 		`/noadmin/newslettersubscribers?page=${awtdSearchParams.page || 1}&limit=${
	// 			awtdSearchParams.limit || 10
	// 		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	// 	);
	// };

	// const publishIt = async (id) => {
	// 	"use server";
	// 	// const rawFormData = {}
	// 	await fetchurl(`/newslettersubscribers/${id}/publishit`, "PUT", "no-cache");
	// 	revalidatePath(
	// 		`/noadmin/newslettersubscribers?page=${awtdSearchParams.page || 1}&limit=${
	// 			awtdSearchParams.limit || 10
	// 		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	// 	);
	// };

	// const trashIt = async (id) => {
	// 	"use server";
	// 	// const rawFormData = {}
	// 	await fetchurl(`/newslettersubscribers/${id}/trashit`, "PUT", "no-cache");
	// 	revalidatePath(
	// 		`/noadmin/newslettersubscribers?page=${awtdSearchParams.page || 1}&limit=${
	// 			awtdSearchParams.limit || 10
	// 		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	// 	);
	// };

	// const scheduleIt = async (id) => {
	// 	"use server";
	// 	// const rawFormData = {}
	// 	await fetchurl(`/newslettersubscribers/${id}/scheduleit`, "PUT", "no-cache");
	// 	revalidatePath(
	// 		`/noadmin/newslettersubscribers?page=${awtdSearchParams.page || 1}&limit=${
	// 			awtdSearchParams.limit || 10
	// 		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	// 	);
	// };

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/newslettersubscribers/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/newslettersubscribers?page=${
				awtdSearchParams.page || 1
			}&limit=${awtdSearchParams.limit || 10}&sort=${
				awtdSearchParams.sort || "-createdAt"
			}`
		);
	};

	// const handleTrashAll = async () => {
	// 	"use server";
	// 	// const rawFormData = {}
	// 	await fetchurl(`/newslettersubscribers/deleteall`, "PUT", "no-cache");
	// 	revalidatePath(
	// 		`/noadmin/newslettersubscribers?page=${awtdSearchParams.page || 1}&limit=${
	// 			awtdSearchParams.limit || 10
	// 		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	// 	);
	// };

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/newslettersubscribers/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/newslettersubscribers?page=${
				awtdSearchParams.page || 1
			}&limit=${awtdSearchParams.limit || 10}&sort=${
				awtdSearchParams.sort || "-createdAt"
			}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/newslettersubscribers"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newslettersubscribers"
					pageText="Newsletter Subscribers"
					addLink=""
					searchOn="/noadmin/newslettersubscribers"
					objects={newslettersubscribers}
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

export default AdminNewsletterSubscribersIndex;
