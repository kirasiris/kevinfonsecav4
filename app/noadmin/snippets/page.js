import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/snippets/list";

async function getSnippets(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminSnippetsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const snippets = await getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/snippets"
				publishedLink="/noadmin/snippets/published"
				draftLink="/noadmin/snippets/draft"
				scheduledLink="/noadmin/snippets/scheduled"
				trashedLink="/noadmin/snippets/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/snippets"
					pageText="Snippets"
					addLink="/noadmin/snippets/create"
					searchOn="/noadmin/snippets"
					searchedKeyword=""
					objects={snippets}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminSnippetsIndex;
