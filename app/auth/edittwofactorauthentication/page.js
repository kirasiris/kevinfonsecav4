"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import QRCode from "qrcode.react";

const UpdateTwoFactorAuthentication = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [twoFactorAuthData, setTwoFactorAuthData] = useState({
		base32: null,
		otpauth_url: null,
	});
	const { base32, otpauth_url } = twoFactorAuthData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [enabled, setEnabled] = useState(false);
	const [enabledStr, setEnabledStr] = useState(`Enable`);
	const [recoveryToken, setRecoveryToken] = useState(null);
	const [qrCodeImageUrl, setQRCodeImageUrl] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setEnabled(res.data.twoFactorTokenEnabled);
				setEnabledStr(res.data.twoFactorTokenEnabled ? `Enabled` : `Disabled`);
				setRecoveryToken(res.data.twoFactorRecoveryToken);
				setTwoFactorAuthData({
					base32: res.data.twoFactorToken?.base32,
					otpauth_url: res.data.twoFactorToken?.otpauth_url,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(true);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchUser();
	}, [loading]);

	const activate = async (e) => {
		try {
			const res = await fetchurl(`/auth/2fa/enable`, "PUT", "no-cache", {
				website: "beFree",
			});
			setEnabled(res.data.twoFactorTokenEnabled);
			setEnabledStr(`Enabled`);
			setRecoveryToken(res.data.twoFactorRecoveryToken);
			setTwoFactorAuthData({
				base32: res.data.twoFactorToken.base32,
				otpauth_url: res.data.twoFactorToken.otpauth_url,
			});
			setQRCodeImageUrl(res.data.twoFactorToken.otpauth_url);
		} catch (err) {
			console.log(err);
			setError(true);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
		}
	};

	const disactivate = async (e) => {
		try {
			const res = await fetchurl(`/auth/2fa/disable`, "PUT", "no-cache", {
				website: "beFree",
			});
			setEnabled(res.data.twoFactorTokenEnabled);
			setEnabledStr(`Disabled`);
			setRecoveryToken(null);
			setTwoFactorAuthData({
				base32: null,
				otpauth_url: null,
			});
		} catch (err) {
			console.log(err);
			setError(true);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
		}
	};

	return loading || profile === null || profile === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
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
										href={`https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US`}
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
							</ol>
							{enabled && (
								<>
									<hr />
									<div className="align-content-center border border-5 d-flex justify-content-center">
										<QRCode
											value={`${qrCodeImageUrl}`}
											includeMargin={true}
											size={200}
											level={`L`}
											imageSettings={{
												src: `https://static.thenounproject.com/png/649740-200.png`,
												height: 30,
												width: 30,
												excavate: true,
											}}
										/>
									</div>
									<hr />
									{recoveryToken && (
										<>
											<p>
												Please&nbsp;keep&nbsp;this&nbsp;code&nbsp;in&nbsp;a&nbsp;safe&nbsp;but&nbsp;accessible&nbsp;area.
												This&nbsp;is&nbsp;your&nbsp;<b>BACKUP</b>&nbsp;code:
												<br />
												<code>{recoveryToken}</code>
											</p>
										</>
									)}
									<p>
										Copy&nbsp;this&nbsp;to&nbsp;
										<i>Enter&nbsp;a&nbsp;setup&nbsp;key</i>
										&nbsp;to&nbsp;your&nbsp;authenticator app:
										<br />
										<code>{base32}</code>
									</p>
									<p>
										This&nbsp;is&nbsp;the&nbsp;string&nbsp;used&nbsp;for&nbsp;the&nbsp;
										<i>QR&nbsp;Code</i>.
										<b>You&nbsp;can&nbsp;ignore&nbsp;it!.&nbsp;</b>
										<br />
										<code>{otpauth_url}</code>
									</p>
								</>
							)}
							<button
								type={`button`}
								className={`btn btn-${
									!enabled ? `secondary` : `success`
								} btn-sm float-start`}
								onClick={!enabled ? activate : disactivate}
							>
								{enabledStr}
							</button>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateTwoFactorAuthentication;
