import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import EditBasicsForm from "@/forms/auth/updatebasicsform";
import ActivityChart from "@/components/auth/activitychart";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getActivities(params) {
	const res = await fetchurl(`/global/activities${params}`, "GET", "no-cache");
	return res;
}

const Activity = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const getActivitiesData = getActivities(`?user=${auth?.data?._id}`);

	const [activities] = await Promise.all([getActivitiesData]);

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<ActivityChart data={activities?.data} />
				</Globalcontent>
			</div>
		</div>
	);
};

export default Activity;
