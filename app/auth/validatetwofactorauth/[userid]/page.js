import {
	fetchurl,
	setAuthTokenOnServer,
	setUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";

const ValidateTwoFactorAuthentication = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const validateTwoFactorAuthToken = async (formData) => {
		"use server";
		const rawFormData = {
			token: formData.get("token"),
		};

		const userid = awtdParams.userid;

		if (!userid) {
			redirect(`/auth/login`);
		}

		const res = await fetchurl(
			`/auth/2fa/validate/${userid}`,
			"POST",
			"no-cache",
			rawFormData
		);

		// If not success stop
		if (!res?.success) return;

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
		await setAuthTokenOnServer(res?.token);
		const loadUser = await fetchurl(`/auth/me`, "GET", "no-cache");
		await setUserOnServer(loadUser?.data);
		redirect(`/auth/profile`);
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
								<form action={validateTwoFactorAuthToken}>
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

export default ValidateTwoFactorAuthentication;
