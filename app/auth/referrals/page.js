import { Suspense } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";
import List from "@/components/auth/referrals/list";

const ReferralsPage = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Referrals`}
				description={"Your account referrals page"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/referrals`}
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
								<List
									auth={auth}
									objects={auth?.data?.referralLinks?.referredUsers}
								/>
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

export default ReferralsPage;
