import { redirect } from "next/navigation";
import Globalcontent from "@/layout/content";
import ResetPasswordForm from "@/forms/auth/resetpasswordform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const ResetPassword = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	auth?.data?.isOnline && redirect(`/`);

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
				title={`${settings?.data?.title} - Reset Password`}
				description={"Reset your account password"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/resetpassword/${awtdParams.userid}/${awtdParams.resettoken}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<div
					className="container align-content-center container"
					style={{
						height: "100vh",
					}}
				>
					<div className="row">
						<Globalcontent containerClasses="col-lg-12">
							<div className="card">
								<div className="card-header">Reset password</div>
								<div className="card-body">
									<ResetPasswordForm />
								</div>
							</div>
						</Globalcontent>
					</div>
				</div>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ResetPassword;
