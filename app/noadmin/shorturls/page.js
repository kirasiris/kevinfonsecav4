import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/shorturls/list";
import Form from "@/forms/noadmin/shorturls/form";

async function getShortUrls(params) {
	const res = await fetchurl(
		`/extras/tools/urls/regression${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminShortUrlsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const shorturls = await getShortUrls(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/draftit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/publishit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/trashit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/scheduleit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/urls/regression/${id}/all`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
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
			`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`
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
				params={awtdParams}
				searchParams={awtdSearchParams}
				revalidateUrl={`/noadmin/shorturls?page=${page}&limit=${limit}&sort=${sort}`}
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/shorturls"
					pageText="Short Urls"
					addLink="/noadmin/shorturls/create"
					searchOn="/noadmin/shorturls"
					searchedKeyword=""
					objects={shorturls}
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

export default AdminShortUrlsIndex;
