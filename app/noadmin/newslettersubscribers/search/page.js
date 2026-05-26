import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/newslettersubscribers/list";

async function getNewsletterSubscribers(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminNewsletterSubscribersSearchIndex = async ({
	params,
	searchParams,
}) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const newslettersubscribers = await getNewsletterSubscribers(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newslettersubscribers/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newslettersubscribers/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/newslettersubscribers/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/newslettersubscribers/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
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
					searchedKeyword={keyword}
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

export default AdminNewsletterSubscribersSearchIndex;
