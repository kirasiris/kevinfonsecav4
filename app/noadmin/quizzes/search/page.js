import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/quizzes/list";

async function getQuizzes(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminQuizzesSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const quizzes = await getQuizzes(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/quizzes"
				publishedLink="/noadmin/quizzes/published"
				draftLink="/noadmin/quizzes/draft"
				scheduledLink="/noadmin/quizzes/scheduled"
				trashedLink="/noadmin/quizzes/trashed"
				filledLink=""
				categoriesLink="/noadmin/quizzes/categories"
				categoryType="quiz"
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/quizzes"
					pageText="Quizzes"
					addLink="/noadmin/quizzes/create"
					searchOn="/noadmin/quizzes"
					searchedKeyword={keyword}
					objects={quizzes}
					searchParams={awtdSearchParams}
					statusFilter=""
				/>
			</div>
		</div>
	);
};

export default AdminQuizzesSearchIndex;
