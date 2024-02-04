"use client";
import AuthContext from "@/helpers/globalContext";
import { fetchurl, setAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { setAuthToken } from "@/helpers/utilities";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useState, useEffect } from "react";

const Login = ({}) => {
	const router = useRouter();
	const { auth, loadUser } = useContext(AuthContext);

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

		const res = await axios.post(
			`http://localhost:5000/api/v1/auth/login`,
			loginData
		);

		// const res = await fetchurl(
		// 	`http://localhost:5000/api/v1/auth/login`,
		// 	"POST",
		// 	loginData
		// );

		if (res?.data?.data) {
			router.push(`/auth/validatetwofactorauth/${res?.data?.data?._id}`);
			return res.data;
		}

		// If not success stop
		if (!res?.data?.success) return;

		// Else continue
		setAuthToken(res?.data?.token);
		await setAuthTokenOnServer(res?.data?.token);
		await loadUser();
		router.push(`/noadmin`);
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

	auth.isAuthenticated && router.push("/");

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
