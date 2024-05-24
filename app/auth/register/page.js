// "use client";
// import { fetchurl } from "@/helpers/setTokenOnServer";
// import { useRouter } from "next/navigation";
// import { useContext, useState } from "react";
// import { toast } from "react-toastify";
// import AuthContext from "@/helpers/globalContext";
// import MyTextArea from "@/components/global/mytextarea";

// const Register = ({ params, searchParams }) => {
// 	const router = useRouter();
// 	const { auth } = useContext(AuthContext);

// 	auth.isAuthenticated && router.push("/");

// 	const [registerData, setRegisterData] = useState({
// 		username: ``,
// 		name: ``,
// 		email: ``,
// 		password: ``,
// 		password2: ``,
// 		text: ``,
// 	});

// 	const { username, name, email, password, password2, text } = registerData;

// 	const [error, setError] = useState(false);
// 	const [btnText, setBtnTxt] = useState("Submit");

// 	const registerAccount = async (e) => {
// 		e.preventDefault();
// 		try {
// 			setBtnTxt("Submit..");
// 			if (password !== password2) {
// 				toast.error("Passwords do not match");
// 			}

// 			await fetchurl(`/auth/register`, "POST", "no-cache", {
// 				...registerData,
// 				website: "beFree",
// 			});
// 			resetForm();
// 			toast.success(
// 				`An email has been sent to ${registerData.email}. Please verify account`
// 			);
// 			setBtnTxt(btnText);
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

// 	const resetForm = () => {
// 		setRegisterData({
// 			username: ``,
// 			name: ``,
// 			email: ``,
// 			password: ``,
// 			password2: ``,
// 			text: ``,
// 		});
// 	};

// 	return (
// 		<div className="container">
// 			<div className="row">
// 				<div className="col-lg-12">
// 					<form onSubmit={registerAccount}>
// 						<label htmlFor="username" className="form-label">
// 							Username
// 						</label>
// 						<input
// 							id="username"
// 							name="username"
// 							value={username}
// 							onChange={(e) => {
// 								setRegisterData({
// 									...registerData,
// 									username: e.target.value,
// 								});
// 							}}
// 							type="text"
// 							className="form-control mb-3"
// 							placeholder="john@doe.com"
// 						/>
// 						<label htmlFor="name" className="form-label">
// 							Name
// 						</label>
// 						<input
// 							id="name"
// 							name="name"
// 							value={name}
// 							onChange={(e) => {
// 								setRegisterData({
// 									...registerData,
// 									name: e.target.value,
// 								});
// 							}}
// 							type="text"
// 							className="form-control mb-3"
// 							placeholder="john@doe.com"
// 						/>
// 						<label htmlFor="email" className="form-label">
// 							Email
// 						</label>
// 						<input
// 							id="email"
// 							name="email"
// 							value={email}
// 							onChange={(e) => {
// 								setRegisterData({
// 									...registerData,
// 									email: e.target.value,
// 								});
// 							}}
// 							type="email"
// 							className="form-control mb-3"
// 							placeholder="john@doe.com"
// 						/>
// 						<label htmlFor="password" className="form-label">
// 							Password
// 						</label>
// 						<input
// 							id="password"
// 							name="password"
// 							value={password}
// 							onChange={(e) => {
// 								setRegisterData({
// 									...registerData,
// 									password: e.target.value,
// 								});
// 							}}
// 							type="password"
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
// 								setRegisterData({
// 									...registerData,
// 									password2: e.target.value,
// 								});
// 							}}
// 							type="password"
// 							className="form-control mb-3"
// 							placeholder="******"
// 						/>
// 						<label htmlFor="text" className="form-label">
// 							Introduce Yourself!
// 						</label>
// 						<MyTextArea
// 							id="text"
// 							name="text"
// 							value={text}
// 							objectData={registerData}
// 							setObjectData={setRegisterData}
// 							onModel="User"
// 							advancedTextEditor={false}
// 						/>
// 						<br />
// 						<button
// 							type="submit"
// 							className="btn btn-secondary btn-sm float-start"
// 							disabled={
// 								username.length > 0 &&
// 								name.length > 0 &&
// 								email.length > 0 &&
// 								password.length > 0 &&
// 								password2.length > 0
// 									? !true
// 									: !false
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

// export default Register;

import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Register = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	auth?.data?.isOnline && redirect(`/`);

	const registerAccount = async (formData) => {
		"use server";
		const rawFormData = {
			username: formData.get("username"),
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			password2: formData.get("password2"),
			text: formData.get("text"),
		};
		if (rawFormData.password !== rawFormData.password2) {
			// alert("Passwords do not match");
			console.log("Password do not match");
			return;
		}

		await fetchurl(`/auth/register`, "POST", "no-cache", {
			...rawFormData,
			website: "beFree",
		});
		// alert(
		// 	`An email has been sent to ${rawFormData.email}. Please verify account`
		// );
		console.log(
			`An email has been sent to ${rawFormData.email}. Please verify account`
		);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form action={registerAccount}>
						<label htmlFor="username" className="form-label">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							className="form-control mb-3"
							placeholder="john.doe"
						/>
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
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
						<label htmlFor="text" className="form-label">
							Introduce Yourself!
						</label>
						<MyTextArea
							id="text"
							name="text"
							onModel="User"
							advancedTextEditor={false}
							customPlaceholder="Let's get to know you!"
						/>
						<br />
						<FormButtons />
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
