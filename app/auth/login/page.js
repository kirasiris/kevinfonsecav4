"use client";
import AuthContext from "@/helpers/globalContext";
import { fetchurl, setAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { setAuthToken } from "@/helpers/utilities";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

const Login = ({ params, searchParams }) => {
	const router = useRouter();
	const { auth, loadUser } = useContext(AuthContext);

	auth.isAuthenticated && router.push("/");

	const [loginData, setLoginData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const { email, password, rememberMe } = loginData;

	// Remember me
	useEffect(() => {
		const email = localStorage.getItem("email");
		const password = localStorage.getItem("password");
		email &&
			password &&
			setLoginData((loginData) => ({
				...loginData,
				email,
				password,
				rememberMe: true,
			}));
	}, []);

	const loginAccount = async (e) => {
		e.preventDefault();
		if (rememberMe) {
			localStorage.setItem("email", email);
			localStorage.setItem("password", password);
		} else {
			localStorage.removeItem("email");
			localStorage.removeItem("password");
		}

		const res = await fetchurl(`/auth/login`, "POST", "no-cache", loginData);

		if (res?.data) {
			router.push(`/auth/validatetwofactorauth/${res?.data?._id}`);
			return res;
		}

		// If not success stop
		if (!res?.success) return;

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
		await setAuthTokenOnServer(res?.token);
		setAuthToken(res?.token);
		await loadUser();
		searchParams?.returnpage
			? router.push(searchParams.returnpage)
			: router.push(`/auth/profile`);
	};

	const [passwordShown, setPasswordShown] = useState(false);

	const handlePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};

	const resetForm = () => {
		setLoginData({
			email: "",
			password: "",
			rememberMe: false,
		});
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form onSubmit={loginAccount}>
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							value={email}
							onChange={(e) => {
								setLoginData({
									...loginData,
									email: e.target.value,
								});
							}}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							value={password}
							onChange={(e) => {
								setLoginData({
									...loginData,
									password: e.target.value,
								});
							}}
							type="password"
							className="form-control mb-3"
							placeholder="******"
						/>
						<br />
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={
								email.length > 0 && password.length > 0 ? !true : !false
							}
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
