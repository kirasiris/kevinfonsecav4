import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const VerifyTwoFactorAuthentication = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const verifyTFA = async (formData) => {
		"use server";
		const rawFormData = {
			token: formData.get("token"),
		};

		const userid = awtdParams.userid;

		if (!userid) {
			redirect(`/auth/profile`);
		}

		if (!rawFormData.token) {
			console.log("Not token provided");
			return;
		}

		await fetchurl(`/auth/2fa/verify/${userid}`, "PUT", "no-cache", {
			...rawFormData,
			website: "beFree",
		});
		revalidatePath(`/auth/verifytwofactorauth/660600aa29a40c04c35d6188`);
	};

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
								<form action={verifyTFA}>
									<div className="form-group">
										<label htmlFor="token" className="form-label">
											Token
										</label>
										<div className="input-group">
											<input
												id="token"
												name="token"
												type="text"
												className="form-control mb-3"
												placeholder="012 345"
												required
											/>
										</div>
									</div>
									{auth?.data?.twoFactorTokenEnabled &&
										auth?.data?.twoFactorRecoveryToken !== "" &&
										auth?.data?.twoFactorRecoveryToken !== undefined &&
										auth?.data?.twoFactorRecoveryToken !== null && (
											<>
												<p>
													Please keep this code in a safe but accessible area.
													This is your <b>BACKUP</b> code:
													<br />
													<code>{auth?.data?.twoFactorRecoveryToken}</code>
													<hr />
													<b>You can now close this window</b>
												</p>
											</>
										)}
									<FormButtons />
								</form>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default VerifyTwoFactorAuthentication;
