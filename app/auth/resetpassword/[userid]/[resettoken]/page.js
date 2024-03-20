"use client";
import AuthContext from "@/helpers/globalContext";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useState } from "react";

const ResetPassword = ({ params, searchParams }) => {
	const router = useRouter();
	const { auth } = useContext(AuthContext);

	auth.isAuthenticated && router.push("/");

	const [resetPasswordData, setResetPasswordData] = useState({
		password: "",
		password2: "",
	});

	const { password, password2 } = resetPasswordData;

	const resetPasswordAccount = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			console.log("Passwords do not match");
			return;
		}

		const userid = params.userid;
		const resettoken = params.resettoken;

		if (!userid || !resettoken) {
			console.log("There was an error, please try again");
			return;
		}

		await fetchurl(
			`/auth/resetpassword/${userid}/${resettoken}`,
			"PUT",
			"no-cache",
			{
				...resetPasswordData,
				website: "beFree",
			}
		);

		searchParams?.returnpage
			? router.push(searchParams.returnpage)
			: router.push(`/auth/login`);
	};

	const [passwordShown, setPasswordShown] = useState(false);

	const handlePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};

	const resetForm = () => {
		setResetPasswordData({
			password: "",
			password2: "",
		});
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form onSubmit={resetPasswordAccount}>
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							value={password}
							onChange={(e) => {
								setResetPasswordData({
									...resetPasswordData,
									password: e.target.value,
								});
							}}
							type={passwordShown ? "text" : "password"}
							className="form-control mb-3"
							placeholder="******"
						/>
						<label htmlFor="password2" className="form-label">
							Confirm Password
						</label>
						<input
							id="password2"
							name="password2"
							value={password2}
							onChange={(e) => {
								setResetPasswordData({
									...resetPasswordData,
									password2: e.target.value,
								});
							}}
							type={passwordShown ? "text" : "password"}
							className="form-control mb-3"
							placeholder="******"
						/>
						<br />
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={
								password.length > 0 && password2.length > 0 ? !true : !false
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

export default ResetPassword;
