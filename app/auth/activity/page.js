import { Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import ActivityChart from "@/components/auth/activitychart";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getActivities(params) {
	const res = await fetchurl(`/global/activities${params}`, "GET", "no-cache");
	return res;
}

const Activity = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const getActivitiesData = getActivities(`?user=${auth?.data?._id}`);

	const [activities] = await Promise.all([getActivitiesData]);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Account Activity`}
				description={"Your account activity"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/activity`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div className="container my-4">
				<div className="row">
					<Sidebar />
					<Globalcontent>
						<ActivityChart data={activities?.data} />
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default Activity;
