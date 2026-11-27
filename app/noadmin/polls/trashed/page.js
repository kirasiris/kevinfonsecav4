import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/polls/list";

async function getPolls(params) {
	const res = await fetchurl(
		`/global/polls${params}&status=trash`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminPollsTrashedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const polls = await getPolls(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/polls"
				publishedLink="/noadmin/polls/published"
				draftLink="/noadmin/polls/draft"
				scheduledLink="/noadmin/polls/scheduled"
				trashedLink="/noadmin/polls/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/polls"
					pageText="Polls"
					addLink="/noadmin/polls/create"
					searchOn="/noadmin/polls"
					searchedKeyword=""
					objects={polls}
					searchParams={awtdSearchParams}
					statusFilter="trash"
				/>
			</div>
		</div>
	);
};

export default AdminPollsTrashedIndex;
