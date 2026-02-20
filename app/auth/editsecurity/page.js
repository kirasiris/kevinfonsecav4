import { Suspense } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UpdatePasswordForm from "@/forms/auth/updatepasswordform";
import UpdatePasskeyForm from "@/forms/auth/updatepasskeyform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const UpdatePasswords = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Security`}
				description={"Your account security"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/editsecurity`}
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
								<div className="card mb-3">
									<div className="card-header">Edit&nbsp;Password</div>
									<div className="card-body">
										<UpdatePasswordForm auth={auth} />
									</div>
								</div>
								<div className="card">
									<div className="card-header">Enable&nbsp;Passkeys</div>
									<div className="card-body">
										<UpdatePasskeyForm auth={auth} />
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

export default UpdatePasswords;
