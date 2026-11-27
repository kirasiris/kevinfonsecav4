import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/courses/list";

async function getCourses(params) {
	const res = await fetchurl(
		`/global/courses${params}&postType=course&status=published`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const NFACoursesPublishedIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();
	const courses = await getCourses(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<div className="container-fluid px-0">
			<NFAStatusesMenu
				allLink="/nfabusiness/courses"
				publishedLink="/nfabusiness/courses/published"
				draftLink="/nfabusiness/courses/draft"
				scheduledLink="/nfabusiness/courses/scheduled"
				trashedLink="/nfabusiness/courses/trashed"
				filledLink=""
				categoriesLink=""
				categoryType=""
				pendingLink=""
				fbiDeniedLink=""
				acquiredLink=""
				disposedLink=""
			/>
			<div className="card rounded-0">
				<List
					stripeChargesEnabled={auth?.userStripeChargesEnabled}
					allLink="/nfabusiness/courses"
					pageText="Courses"
					addLink="/nfabusiness/courses/create"
					searchOn="/nfabusiness/courses"
					searchedKeyword=""
					objects={courses}
					searchParams={awtdSearchParams}
					statusFilter="published"
					postType="course"
				/>
			</div>
		</div>
	);
};

export default NFACoursesPublishedIndex;
