import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/reports/list";

async function getReports(params) {
	const res = await fetchurl(`/global/reports${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminReportsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const reports = await getReports(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/reports"
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
					allLink="/noadmin/reports"
					pageText="Reports"
					addLink=""
					searchOn="/noadmin/reports"
					searchedKeyword={keyword}
					objects={reports}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminReportsSearchIndex;
