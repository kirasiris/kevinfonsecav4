import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";
import Globalcontent from "@/layout/content";
import Link from "next/link";

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
			// text: formData.get("text"),
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
		<>
			<style>
				{`
					footer: {
						margin-top: 0px !important;
					}
				`}
			</style>
			<div
				className="container align-content-center container"
				style={{
					height: "100vh",
				}}
			>
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						<div className="card">
							<div className="card-header">Register</div>
							<div className="card-body">
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
									{/* <label htmlFor="text" className="form-label">
										Introduce Yourself!
									</label>
									<MyTextArea
										id="text"
										name="text"
										onModel="User"
										advancedTextEditor={false}
										customPlaceholder="Let's get to know you!"
									/> */}
									<br />
									<FormButtons />
								</form>
							</div>
							<div className="card-footer">
								<Link
									href={{
										pathname: `/auth/login`,
										query: {},
									}}
								>
									Login
								</Link>
								&nbsp;|&nbsp;
								<Link
									href={{
										pathname: `/auth/recover`,
										query: {},
									}}
								>
									Forgot password?
								</Link>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default Register;
