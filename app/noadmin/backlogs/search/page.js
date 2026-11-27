import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/backlogs/list";

async function getBacklogs(params) {
	const res = await fetchurl(`/global/backlogs${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminBacklogsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const backlogs = await getBacklogs(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/backlogs"
				publishedLink="/noadmin/backlogs/published"
				draftLink="/noadmin/backlogs/draft"
				scheduledLink=""
				trashedLink="/noadmin/backlogs/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/backlogs"
					pageText="Backlogs"
					addLink="/noadmin/backlogs/create"
					searchOn="/noadmin/backlogs"
					searchedKeyword={keyword}
					objects={backlogs}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminBacklogsSearchIndex;
