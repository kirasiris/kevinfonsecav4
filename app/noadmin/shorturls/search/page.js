import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/shorturls/list";
import CreateShortUrlForm from "@/forms/noadmin/shorturls/createshorturlform";

async function getShortUrls(params) {
	const res = await fetchurl(
		`/global/extras/shorturls${params}&postType=short`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminShortUrlsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const auth = await getUserOnServer();

	const shorturls = await getShortUrls(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/shorturls"
				publishedLink="/noadmin/shorturls/published"
				draftLink="/noadmin/shorturls/draft"
				scheduledLink="/noadmin/shorturls/scheduled"
				trashedLink="/noadmin/shorturls/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<CreateShortUrlForm
						auth={auth}
						currentpage={`/noadmin/shorturls/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`}
					/>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/shorturls"
							pageText="Short Urls"
							addLink="/noadmin/shorturls/create"
							searchOn="/noadmin/shorturls"
							searchedKeyword={keyword}
							objects={shorturls}
							searchParams={awtdSearchParams}
							statusFilter=""
							postType="short"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminShortUrlsSearchIndex;
