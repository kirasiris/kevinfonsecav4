import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import UpdateAboutForm from "@/forms/auth/updateaboutform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getProfiles(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const UpdateAbout = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const getProfilesData = getProfiles(`?isEmailConfirmed=true`);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit&nbsp;About</div>
						<div className="card-body">
							<UpdateAboutForm auth={auth} profiles={profiles} />
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateAbout;
