import Globalcontent from "@/layout/content";
import ValidateTwoFactorAuthenticationForm from "@/forms/auth/validatetwofactorauthentication";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const ValidateTwoFactorAuthentication = async ({ params, searchParams }) => {
	const awtdParams = await params;

	const { settings } = await getGlobalData();

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
				title={`${settings?.data?.title} - Validate 2FA`}
				description={"Validate your 2FA"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/validatetwofactorauth/${awtdParams.userid}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
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
								<ValidateTwoFactorAuthenticationForm />
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default ValidateTwoFactorAuthentication;
