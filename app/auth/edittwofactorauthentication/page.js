import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import QRC from "@/components/global/qrcode";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const UpdateTwoFactorAuthentication = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const activate = async (formData) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/auth/2fa/enable`, "PUT", "no-cache", {
			website: "beFree",
		});
		revalidatePath(`/auth/edittwofactorauthentication`);
	};

	const disactivate = async (formData) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/auth/2fa/disable`, "PUT", "no-cache", {
			website: "beFree",
		});
		revalidatePath(`/auth/edittwofactorauthentication`);
	};

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Account 2FA`}
				description={"Your account 2FA"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/edittwofactorauthentication`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div className="container my-4">
				<div className="row">
					<Sidebar />
					<Globalcontent>
						<div className="card">
							<div className="card-header">Edit&nbsp;2FA</div>
							<div className="card-body">
								<h6>Instructions</h6>
								<ol className={`mx-3`}>
									<li>
										On&nbsp;your&nbsp;phone,&nbsp;go&nbsp;to&nbsp;the&nbsp;app&nbsp;store
									</li>
									<li>
										Search&nbsp;for&nbsp;<i>Google&nbsp;Authenticator</i>
									</li>
									<li>
										Download&nbsp;and&nbsp;Install&nbsp;the&nbsp;
										<a
											href={`https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2`}
											target={`_blank`}
											rel={`noopener noreferrer`}
										>
											<b className="text-bg-primary text-decoration-underline">
												Google&nbsp;Authenticator&nbsp;App
											</b>
										</a>
									</li>
								</ol>
								<h6>
									Open&nbsp;and&nbsp;Configure&nbsp;the&nbsp;Google&nbsp;Authenticator&nbsp;App
								</h6>
								<ol className={`mx-3`}>
									<li>
										In&nbsp;Google&nbsp;Authenticator,&nbsp;touch&nbsp;the&nbsp;
										<i className={`fas fa-plus me-1`} />
										&nbsp;and&nbsp;select&nbsp;any&nbsp;of&nbsp;the&nbsp;following&nbsp;options:
										<ul className={`mx-4`}>
											<li>
												<i className={`fas fa-camera me-1`} />
												Scan&nbsp;a&nbsp;QR&nbsp;Code
											</li>
											<li>
												<i className={`fas fa-keyboard me-1`} />
												Enter&nbsp;a&nbsp;setup&nbsp;key
											</li>
										</ul>
									</li>
									<li>
										In&nbsp;case,&nbsp;you&nbsp;have&nbsp;enabled&nbsp;it&nbsp;and&nbsp;then&nbsp;disabled&nbsp;it
										<ul>
											<li>
												Don&apos;t&nbsp;forget&nbsp;to&nbsp;delete&nbsp;the&nbsp;token&nbsp;from&nbsp;your&nbsp;
												<a
													href={`https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2`}
													target={`_blank`}
													rel={`noopener noreferrer`}
												>
													<b className="text-bg-primary text-decoration-underline">
														Google&nbsp;Authenticator&nbsp;App
													</b>
												</a>
											</li>
										</ul>
									</li>
								</ol>
								{auth?.data?.twoFactorToken.otpauth_url !== "" &&
									auth?.data?.twoFactorToken.otpauth_url !== null && (
										<>
											<hr />
											<div className="align-content-center border border-5 d-flex justify-content-center">
												<QRC value={auth?.data?.twoFactorToken?.otpauth_url} />
											</div>
											<hr />
											{auth?.data?.twoFactorRecoveryToken && (
												<>
													<p>
														Please&nbsp;keep&nbsp;this&nbsp;code&nbsp;in&nbsp;a&nbsp;safe&nbsp;but&nbsp;accessible&nbsp;area.
														This&nbsp;is&nbsp;your&nbsp;<b>BACKUP</b>&nbsp;code:
														<br />
														<code>{auth?.data?.twoFactorRecoveryToken}</code>
													</p>
												</>
											)}
											<p>
												Copy&nbsp;this&nbsp;to&nbsp;
												<i>Enter&nbsp;a&nbsp;setup&nbsp;key</i>
												&nbsp;to&nbsp;your&nbsp;authenticator app:
												<br />
												<code>{auth?.data?.twoFactorToken.base32}</code>
											</p>
											<p>
												This&nbsp;is&nbsp;the&nbsp;string&nbsp;used&nbsp;for&nbsp;the&nbsp;
												<i>QR&nbsp;Code</i>.
												<b>You&nbsp;can&nbsp;ignore&nbsp;it!.&nbsp;</b>
												<br />
												<code>{auth?.data?.twoFactorToken?.otpauth_url}</code>
											</p>
										</>
									)}
								<form
									action={
										!auth?.data?.twoFactorTokenEnabled ? activate : disactivate
									}
								>
									<button
										type={`submit`}
										className={`btn btn-${
											!auth?.data?.twoFactorTokenEnabled
												? `secondary`
												: `success`
										} btn-sm float-start`}
									>
										{auth?.data?.twoFactorTokenEnabled ? "Enabled" : "Disabled"}
									</button>
								</form>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default UpdateTwoFactorAuthentication;
