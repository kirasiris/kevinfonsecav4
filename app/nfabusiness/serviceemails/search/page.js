import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/serviceemails/list";

async function getServiceEmails(params) {
	const res = await fetchurl(
		`/global/serviceemails${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const NFAServiceEmailsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const serviceemails = await getServiceEmails(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/serviceemails/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/serviceemails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/serviceemails/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/serviceemails?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/serviceemails/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/nfabusiness/serviceemails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/serviceemails"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/serviceemails"
					pageText="Service Emails"
					addLink=""
					searchOn="/nfabusiness/serviceemails"
					searchedKeyword={keyword}
					objects={serviceemails}
					searchParams={awtdSearchParams}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default NFAServiceEmailsSearchIndex;
