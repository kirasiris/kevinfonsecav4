import { Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UpdateAboutForm from "@/forms/auth/updateaboutform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getProfiles(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const UpdateAbout = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const getProfilesData = getProfiles(`?isEmailConfirmed=true`);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Account About`}
				description={"Your account about"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/editabout`}
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
						<div className="card">
							<div className="card-header">Edit&nbsp;About</div>
							<div className="card-body">
								<UpdateAboutForm auth={auth} profiles={profiles} />
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default UpdateAbout;
