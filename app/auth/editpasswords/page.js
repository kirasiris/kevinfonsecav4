"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";

const UpdatePasswords = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [passwordData, setPasswordData] = useState({
		currentpassword: ``,
		newpassword: ``,
		newpassword2: ``,
		token: ``,
	});

	const { currentpassword, newpassword, newpassword2, token } = passwordData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [btnText, setBtnTxt] = useState("Submit");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
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

	const upgradePassword = async (e) => {
		e.preventDefault();
		try {
			setBtnTxt("Submit...");
			await fetchurl(`/auth/updatepassword`, "PUT", "no-cache", {
				...passwordData,
				website: "beFree",
			});
			resetForm();
			toast.success("Account updated");
			setBtnTxt(btnText);
			router.push(`/auth/profile`);
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
		setPasswordData({
			currentpassword: ``,
			newpassword: ``,
			newpassword2: ``,
			token: ``,
		});
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
						<div className="card-header">Edit&nbsp;Password</div>
						<div className="card-body">
							<form onSubmit={upgradePassword}>
								<label htmlFor="currentpassword" className="form-label">
									Current&nbsp;Password
								</label>
								<input
									id="currentpassword"
									name="currentpassword"
									value={currentpassword}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											currentpassword: e.target.value,
										});
									}}
									type="password"
									className="form-control mb-3"
								/>
								<label htmlFor="newpassword" className="form-label">
									New&nbsp;Password
								</label>
								<input
									id="newpassword"
									name="newpassword"
									value={newpassword}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											newpassword: e.target.value,
										});
									}}
									type="password"
									className="form-control mb-3"
								/>
								<label htmlFor="newpassword2" className="form-label">
									Confirm&nbsp;Password
								</label>
								<input
									id="newpassword2"
									name="newpassword2"
									value={newpassword2}
									onChange={(e) => {
										setPasswordData({
											...passwordData,
											newpassword2: e.target.value,
										});
									}}
									type="password"
									className="form-control mb-3"
								/>
								{profile.twoFactorTokenEnabled && (
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
													setPasswordData({
														...passwordData,
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
								)}
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
									disabled={
										currentpassword?.length > 0 &&
										newpassword?.length > 0 &&
										newpassword2?.length > 0
											? !true
											: !false
									}
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

export default UpdatePasswords;
