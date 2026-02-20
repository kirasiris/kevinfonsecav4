import { Suspense } from "react";
import { redirect } from "next/navigation";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import VerifyTwoFactorAuthenticationForm from "@/forms/auth/verifytwofactorauthform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const VerifyTwoFactorAuthentication = async ({ params, searchParams }) => {
	const awtdParams = await params;

	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<>
			<style>
				{`
					footer: {
						margin-top: 0px !important;
					}
				`}
			</style>
			<Head
				title={`${settings?.data?.title} - Verify 2FA`}
				description={"Verify your 2FA"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/verifytwofactorauth/${awtdParams.userid}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<div
						className="container align-content-center container"
						style={{
							height: "100vh",
						}}
					>
						<div className="row">
							<Globalcontent containerClasses="col-lg-12">
								<div className="card">
									<div className="card-header">
										Please&nbsp;enter&nbsp;the&nbsp;2FA&nbsp;token&nbsp;given&nbsp;to&nbsp;you&nbsp;by&nbsp;your&nbsp;Authenticator&nbsp;app
									</div>
									<div className="card-body">
										<VerifyTwoFactorAuthenticationForm auth={auth} />
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

export default VerifyTwoFactorAuthentication;
