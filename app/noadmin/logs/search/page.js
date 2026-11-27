import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/logs/list";

async function getLogs(params) {
	const res = await fetchurl(`/global/logs${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
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

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/logs"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/logs"
					pageText="Logs"
					addLink=""
					searchOn="/noadmin/logs"
					searchedKeyword={keyword}
					objects={logs}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminLogsSearchIndex;
