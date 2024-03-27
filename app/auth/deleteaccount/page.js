"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";

const DeleteAccount = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [deleteData, setDeleteAccountData] = useState({
		email: ``,
		token: ``,
	});

	const { email, token } = deleteData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

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

	const deleteMyAccount = async (e) => {
		e.preventDefault();
		await fetchurl(`/auth/deleteaccount`, "POST", "no-cache", deleteData);
		router.push(`/auth/login`);
	};

	const resetForm = () => {
		setDeleteAccountData({
			email: ``,
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
						<div className="card-header text-bg-danger text-uppercase">
							THIS&nbsp;CAN&nbsp;NOT&nbsp;BE&nbsp;UNDONE!
						</div>
						<div className="card-body">
							<form onSubmit={deleteMyAccount}>
								<label htmlFor="email" className="form-label">
									Please&nbsp;enter&nbsp;your&nbsp;email&nbsp;as&nbsp;shown&nbsp;in&nbsp;the&nbsp;placeholder!
								</label>
								<input
									id="email"
									name="email"
									value={email}
									onChange={(e) => {
										setDeleteAccountData({
											...deleteData,
											email: e.target.value,
										});
									}}
									type="email"
									className="form-control mb-3"
									placeholder={`${profile.email}`}
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
													setDeleteAccountData({
														...deleteData,
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
									disabled={email?.length > 0 ? !true : !false}
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
						<div className="card-footer text-bg-danger text-uppercase">
							If&nbsp;for&nbsp;some&nbsp;reason&nbsp;the&nbsp;email&nbsp;shown&nbsp;above&nbsp;does&nbsp;not&nbsp;match&nbsp;with&nbsp;yours,&nbsp;please&nbsp;close&nbsp;the&nbsp;session&nbsp;and&nbsp;exit&nbsp;this&nbsp;webpage
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default DeleteAccount;
