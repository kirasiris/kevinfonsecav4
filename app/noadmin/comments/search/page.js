import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/comments/list";

async function getComments(params) {
	const res = await fetchurl(
		`/global/comments${params}&postType=comment`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminCommentsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const comments = await getComments(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/comments"
				publishedLink="/noadmin/comments/published"
				draftLink="/noadmin/comments/draft"
				scheduledLink=""
				trashedLink="/noadmin/comments/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/comments"
					pageText="Comments"
					addLink=""
					searchOn="/noadmin/comments"
					searchedKeyword={keyword}
					objects={comments}
					searchParams={awtdSearchParams}
					statusFilter=""
					postType="comment"
				/>
			</div>
		</div>
	);
};

export default AdminCommentsSearchIndex;
