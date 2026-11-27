import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/newsletteremails/list";

async function getNewsletterEmails(params) {
	const res = await fetchurl(
		`/global/newsletteremails${params}&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminNewsletterEmailsPublishedIndex = async ({
	params,
	searchParams,
}) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const newsletteremails = await getNewsletterEmails(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/newsletteremails"
				publishedLink="/noadmin/newsletteremails/published"
				draftLink="/noadmin/newsletteremails/draft"
				scheduledLink="/noadmin/newsletteremails/scheduled"
				trashedLink="/noadmin/newsletteremails/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/newsletteremails"
					pageText="Newsletter Emails"
					addLink="/noadmin/newsletteremails/create"
					searchOn="/noadmin/newsletteremails"
					searchedKeyword=""
					objects={newsletteremails}
					searchParams={awtdSearchParams}
					statusFilter="draft"
				/>
			</div>
		</div>
	);
};

export default AdminNewsletterEmailsPublishedIndex;
