import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/categories/list";
import CreateQuizCategoryForm from "@/forms/noadmin/quizzes/createquizcategoryform";

async function getCategories(params) {
	const res = await fetchurl(
		`/global/categories${params}&categoryType=quiz`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminPageCategoriesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const categories = await getCategories(
		`?page=${page}&limit=${limit}&sort=${sort}`,
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
			<div className="row">
				<div className="col">
					<CreateQuizCategoryForm objects={categories} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/quizzes/categories"
							pageText="Quizzes Categories"
							addLink="/noadmin/quizzes/categories"
							searchOn="/noadmin/categories"
							searchedKeyword=""
							objects={categories}
							searchParams={awtdSearchParams}
							statusFilter=""
							categoryType="quiz"
							handleAllUsageCountEnabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPageCategoriesIndex;
