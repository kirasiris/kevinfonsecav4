import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/blogs/list";

async function getBlogs(params) {
	const res = await fetchurl(
		`/global/blogs${params}&postType=blog&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminBlogsPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const blogs = await getBlogs(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/blogs"
				publishedLink="/noadmin/blogs/published"
				draftLink="/noadmin/blogs/draft"
				scheduledLink="/noadmin/blogs/scheduled"
				trashedLink="/noadmin/blogs/trashed"
				filledLink=""
				categoriesLink="/noadmin/blogs/categories"
				categoryType="blog"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/blogs"
					pageText="Blogs"
					addLink="/noadmin/blogs/create"
					searchOn="/noadmin/blogs"
					searchedKeyword=""
					objects={blogs}
					searchParams={awtdSearchParams}
					statusFilter="published"
					postType="blog"
				/>
			</div>
		</div>
	);
};

export default AdminBlogsPublishedIndex;
