import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/secrets/list";

async function getSecrets(params) {
	const res = await fetchurl(
		`/global/secrets${params}&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminSecretsPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const secrets = await getSecrets(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/secrets"
				publishedLink="/noadmin/secrets/published"
				draftLink="/noadmin/secrets/draft"
				scheduledLink=""
				trashedLink="/noadmin/secrets/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/secrets"
					pageText="Secrets"
					addLink="/noadmin/secrets/create"
					searchOn="/noadmin/secrets"
					searchedKeyword=""
					objects={secrets}
					searchParams={awtdSearchParams}
					statusFilter="published"
				/>
			</div>
		</div>
	);
};

export default AdminSecretsPublishedIndex;
