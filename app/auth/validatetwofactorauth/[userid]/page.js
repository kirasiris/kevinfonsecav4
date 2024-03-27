"use client";
import AuthContext from "@/helpers/globalContext";
import { fetchurl, setAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { setAuthToken } from "@/helpers/utilities";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Globalcontent from "@/layout/content";

const TwoFactorAuthenticationToken = ({ params, searchParams }) => {
	const { loadUser } = useContext(AuthContext);
	const router = useRouter();

	const [tokenData, setTokenData] = useState({
		token: ``,
	});
	const { token } = tokenData;

	const validateTwoFactorAuthentication = async (e) => {
		e.preventDefault();
		const res = await fetchurl(
			`/auth/2fa/validate/${params.userid}`,
			"POST",
			"no-cache",
			tokenData
		);

		// If not success stop
		if (!res?.success) return;

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
		await setAuthTokenOnServer(res?.token);
		setAuthToken(res?.token);
		await loadUser();
		router.push(`/auth/profile`);
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
							<form onSubmit={validateTwoFactorAuthentication}>
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
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
									disabled={token?.length > 0 ? !true : !false}
								>
									Submit
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

export default TwoFactorAuthenticationToken;
