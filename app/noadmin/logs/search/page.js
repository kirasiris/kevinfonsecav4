import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/logs/list";

async function getLogs(params) {
	const res = await fetchurl(`/global/logs${params}`, "GET", "no-cache");
	return res;
}

const AdminLogsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const logs = await getLogs(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/logs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/logs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/logs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/logs/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/logs"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/logs"
					pageText="Logs"
					searchOn="/noadmin/logs"
					searchedKeyword={keyword}
					objects={logs}
					searchParams={awtdSearchParams}
					handleDelete={handleDelete}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminLogsSearchIndex;
