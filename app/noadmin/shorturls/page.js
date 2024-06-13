import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/shorturls/list";
import { revalidatePath } from "next/cache";
import Form from "./form";

async function getShortUrls(params) {
	const res = await fetchurl(`/extras/shorturls${params}`, "GET", "no-cache");
	return res;
}

const AdminShortUrlsIndex = async ({ params, searchParams }) => {
	const shorturls = await getShortUrls(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/shorturls/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/shorturls/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${searchParams.page || 1}&limit=${
				searchParams.limit || 10
			}&sort=${searchParams.sort || "-createdAt"}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/shorturls"
				publishedLink="/noadmin/shorturls/published"
				draftLink="/noadmin/shorturls/draft"
				scheduledLink="/noadmin/shorturls/scheduled"
				trashedLink="/noadmin/shorturls/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<Form
				params={params}
				searchParams={searchParams}
				revalidateUrl={`/noadmin/shorturls?page=${
					searchParams.page || 1
				}&limit=${searchParams.limit || 10}&sort=${
					searchParams.sort || "-createdAt"
				}`}
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/shorturls"
					pageText="Short Urls"
					addLink="/noadmin/shorturls/create"
					searchOn="/noadmin/shorturls"
					objects={shorturls}
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

export default AdminShortUrlsIndex;
