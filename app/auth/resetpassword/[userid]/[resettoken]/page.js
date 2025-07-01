import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Globalcontent from "@/layout/content";
import ResetPasswordForm from "@/forms/auth/resetpasswordform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const ResetPassword = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

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
		</>
	);
};

export default ResetPassword;
