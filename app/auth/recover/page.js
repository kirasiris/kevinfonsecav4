"use client";
import AuthContext from "@/helpers/globalContext";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useState } from "react";

const Login = ({ params, searchParams }) => {
	const router = useRouter();
	const { auth } = useContext(AuthContext);

	auth.isAuthenticated && router.push("/");

	const [recoverData, setRecoverData] = useState({
		email: "",
	});

	const { email } = recoverData;

	const recoverAccount = async (e) => {
		e.preventDefault();

		await fetchurl(`/auth/forgotpassword`, "POST", "no-cache", {
			...recoverData,
			website: "beFree",
		});

		searchParams?.returnpage
			? router.push(searchParams.returnpage)
			: router.push(`/auth/login`);
	};

	const resetForm = () => {
		setRecoverData({
			email: "",
		});
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form onSubmit={recoverAccount}>
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setRecoverData({
									...recoverData,
									email: e.target.value,
								});
							}}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
						<br />
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={email.length > 0 ? !true : !false}
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
		</div>
	);
};

export default Login;