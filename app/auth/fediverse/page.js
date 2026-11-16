import { Suspense } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";
import ConnectFediverseForm from "@/forms/auth/connectfediverseform";

const Fediverse = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Fediverse`}
				description={"Connect your account to the Fediverse"}
				favicon={settings?.data?.favicon?.location?.secure_location}
				postImage={settings.data.showcase_image?.location?.secure_location}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/fediverse`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<div className="container my-4">
						<div className="row">
							<Sidebar />
							<Globalcontent>
								<div className="card mb-4">
									<div className="card-header">
										Connect&nbsp;Your&nbsp;Account&nbsp;to&nbsp;the&nbsp;Fediverse
									</div>
									<div className="card-body">
										<ConnectFediverseForm auth={auth} />
									</div>
								</div>
							</Globalcontent>
						</div>
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default Fediverse;
