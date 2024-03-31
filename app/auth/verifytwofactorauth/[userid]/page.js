"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Globalcontent from "@/layout/content";

const VerifyTwoFactorAuthentication = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	const [tokenData, setTokenData] = useState({
		token: ``,
	});
	const { token } = tokenData;

	const [verified, setVerified] = useState(false);
	const [recoveryToken, setRecoveryToken] = useState(``);
	const [error, setError] = useState(false);
	const [btnText, setBtnText] = useState("Submit");

	const verifyTFA = async (e) => {
		e.preventDefault();
		try {
			setBtnText("Submit...");
			const userid = params.userid;
			if (!userid) {
				toast.error("There was an error, please try again");
				router.push("/auth/profile");
			}

			const res = await fetchurl(
				`/auth/2fa/verify/${userid}`,
				"PUT",
				"no-cache",
				{ ...tokenData, website: "beFree" }
			);
			setVerified(true);
			setRecoveryToken(res?.data);
			resetForm();
			toast.success("2FA was successfully verified");
			setBtnText(btnText);
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

	const resetForm = () => {
		setTokenData({
			token: ``,
		});
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Globalcontent containerClasses="col-lg-12">
					<div className="card">
						<div className="card-header">
							Please&nbsp;enter&nbsp;the&nbsp;2FA&nbsp;token&nbsp;given&nbsp;to&nbsp;you&nbsp;by&nbsp;your&nbsp;Authenticator&nbsp;app
						</div>
						<div className="card-body">
							<form onSubmit={verifyTFA}>
								<div className="form-group">
									<label htmlFor="token" className="form-label">
										Token
									</label>
									<div className="input-group">
										<input
											id="token"
											name="token"
											value={token}
											onChange={(e) => {
												setTokenData({
													...tokenData,
													token: e.target.value,
												});
											}}
											type="text"
											className="form-control mb-3"
											placeholder="012 345"
											required
										/>
									</div>
								</div>
								{verified && (
									<>
										<p>
											Please keep this code in a safe but accessible area. This
											is your <b>BACKUP</b> code:
											<br />
											<code>{recoveryToken}</code>
											<br />
											You can now close this window
										</p>
									</>
								)}
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
									disabled={token?.length > 0 ? !true : !false}
								>
									{btnText}
								</button>
								<button
									type="button"
									className="btn btn-secondary btn-sm float-end"
									onClick={resetForm}
								>
									Reset
								</button>
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default VerifyTwoFactorAuthentication;
