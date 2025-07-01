import Globalcontent from "@/layout/content";
import ValidateTwoFactorAuthenticationForm from "@/forms/auth/validatetwofactorauthentication";

const ValidateTwoFactorAuthentication = async ({ params, searchParams }) => {
	return (
		<>
			<style>
				{`
					footer: {
						margin-top: 0px !important;
					}
				`}
			</style>
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
