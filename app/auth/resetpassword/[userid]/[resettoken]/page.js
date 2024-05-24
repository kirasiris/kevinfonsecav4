// "use client";
// import { fetchurl } from "@/helpers/setTokenOnServer";
// import { useRouter } from "next/navigation";
// import { useContext, useState } from "react";
// import { toast } from "react-toastify";
// import AuthContext from "@/helpers/globalContext";

// const ResetPassword = ({ params, searchParams }) => {
// 	const router = useRouter();
// 	const { auth } = useContext(AuthContext);

// 	auth.isAuthenticated && router.push("/");

// 	const [resetPasswordData, setResetPasswordData] = useState({
// 		password: "",
// 		password2: "",
// 	});

// 	const { password, password2 } = resetPasswordData;

// 	const [error, setError] = useState(false);
// 	const [btnText, setBtnTxt] = useState("Submit");

// 	const resetPasswordAccount = async (e) => {
// 		e.preventDefault();
// 		try {
// 			setBtnTxt("Submit...");
// 			if (password !== password2) {
// 				console.log("Passwords do not match");
// 				return;
// 			}

// 			const userid = params.userid;
// 			const resettoken = params.resettoken;

// 			if (!userid || !resettoken) {
// 				console.log(
// 					"There was an error with the credentials given, please try again"
// 				);
// 				return;
// 			}

// 			await fetchurl(
// 				`/auth/resetpassword/${userid}/${resettoken}`,
// 				"PUT",
// 				"no-cache",
// 				{
// 					...resetPasswordData,
// 					website: "beFree",
// 				}
// 			);
// 			resetForm();
// 			toast.success(`New password has been created`);
// 			setBtnTxt(btnText);
// 			searchParams?.returnpage
// 				? router.push(searchParams.returnpage)
// 				: router.push(`/auth/login`);
// 		} catch (err) {
// 			console.log(err);
// 			setError(true);
// 			// const error = err.response.data.message;
// 			const error = err?.response?.data?.error?.errors;
// 			const errors = err?.response?.data?.errors;

// 			if (error) {
// 				// dispatch(setAlert(error, 'danger'));
// 				error &&
// 					Object.entries(error).map(([, value]) => toast.error(value.message));
// 			}

// 			if (errors) {
// 				errors.forEach((error) => toast.error(error.msg));
// 			}

// 			toast.error(err?.response?.statusText);
// 			return {
// 				msg: err?.response?.statusText,
// 				status: err?.response?.status,
// 			};
// 		}
// 	};

// 	const [passwordShown, setPasswordShown] = useState(false);

// 	const handlePasswordVisibility = () => {
// 		setPasswordShown(passwordShown ? false : true);
// 	};

// 	const resetForm = () => {
// 		setResetPasswordData({
// 			password: "",
// 			password2: "",
// 		});
// 	};

// 	return (
// 		<div className="container">
// 			<div className="row">
// 				<div className="col-lg-12">
// 					<form onSubmit={resetPasswordAccount}>
// 						<label htmlFor="password" className="form-label">
// 							Password
// 						</label>
// 						<input
// 							id="password"
// 							name="password"
// 							value={password}
// 							onChange={(e) => {
// 								setResetPasswordData({
// 									...resetPasswordData,
// 									password: e.target.value,
// 								});
// 							}}
// 							type={passwordShown ? "text" : "password"}
// 							className="form-control mb-3"
// 							placeholder="******"
// 						/>
// 						<label htmlFor="password2" className="form-label">
// 							Confirm Password
// 						</label>
// 						<input
// 							id="password2"
// 							name="password2"
// 							value={password2}
// 							onChange={(e) => {
// 								setResetPasswordData({
// 									...resetPasswordData,
// 									password2: e.target.value,
// 								});
// 							}}
// 							type={passwordShown ? "text" : "password"}
// 							className="form-control mb-3"
// 							placeholder="******"
// 						/>
// 						<br />
// 						<button
// 							type="submit"
// 							className="btn btn-secondary btn-sm float-start"
// 							disabled={
// 								password.length > 0 && password2.length > 0 ? !true : !false
// 							}
// 						>
// 							{btnText}
// 						</button>
// 						<button
// 							type="button"
// 							className="btn btn-secondary btn-sm float-end"
// 							onClick={resetForm}
// 						>
// 							Reset
// 						</button>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default ResetPassword;
import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const ResetPassword = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	auth?.data?.isOnline && redirect(`/`);

	const resetPasswordAccount = async (formData) => {
		"use server";
		const rawFormData = {
			password: formData.get("password"),
			password2: formData.get("password2"),
		};

		if (rawFormData.password !== rawFormData.password2) {
			// alert("Passwords do not match");
			console.log("Passwords do not match");
			return;
		}

		const userid = params.userid;
		const resettoken = params.resettoken;

		if (!userid || !resettoken) {
			// alert(
			// 	"There was an error with the credentials given, please try again"
			// );
			console.log(
				"There was an error with the credentials given, please try again"
			);
			return;
		}

		await fetchurl(
			`/auth/resetpassword/${userid}/${resettoken}`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				website: "beFree",
			}
		);

		// alert("New password has been created")

		searchParams?.returnpage
			? redirect(searchParams.returnpage)
			: redirect(`/auth/login`);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form action={resetPasswordAccount}>
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							className="form-control mb-3"
							placeholder="******"
						/>
						<label htmlFor="password2" className="form-label">
							Confirm Password
						</label>
						<input
							id="password2"
							name="password2"
							type="password"
							className="form-control mb-3"
							placeholder="******"
						/>
						<br />
						<FormButtons />
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
