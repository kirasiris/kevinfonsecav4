"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";
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
			const res = await fetchurl(`/auth/2fa/enable`, "PUT", "no-cache");
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
			const res = await fetchurl(`/auth/2fa/disable`, "PUT", "no-cache");
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
						<div className="card-header">Edit 2FA</div>
						<div className="card-body">
							<h6>Instructions</h6>
							<ol className={`mx-3`}>
								<li>On your phone, go to the app store</li>
								<li>
									Search for <i>Google Authenticator</i>
								</li>
								<li>
									Download and Install the{" "}
									<a
										href={`https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US&gl=US`}
										target={`_blank`}
										rel={`noopener noreferrer`}
									>
										<b className="text-bg-primary text-decoration-underline">
											Google Authenticator App
										</b>
									</a>
								</li>
							</ol>
							<h6>Open and Configure the Google Authenticator App</h6>
							<ol className={`mx-3`}>
								<li>
									In Google Authenticator, touch the{" "}
									<i className={`fas fa-plus me-1`} />
									and select any of the following options:
									<ul className={`mx-4`}>
										<li>
											<i className={`fas fa-camera me-1`} />
											Scan a QR Code
										</li>
										<li>
											<i className={`fas fa-keyboard me-1`} />
											Enter a setup key
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
												Please keep this code in a safe but accessible area.
												This is your <b>BACKUP</b> code:
												<br />
												<code>{recoveryToken}</code>
												<br />
												You can now close this window
											</p>
										</>
									)}
									<p>
										Copy this to <i>Enter a setup key</i> to your authenticator
										app:
										<br />
										<code>{base32}</code>
									</p>
									<p>
										This is the string used for the <i>QR Code</i>.
										<b>You can ignore it!. </b>
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
