import {
	fetchurl,
	setAuthTokenOnServer,
	setUserStripeChargesEnabled,
	setUserIdOnServer,
	setUserUsernameOnServer,
	setUserEmailOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Login = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	auth?.data?.isOnline && redirect(`/`);

	const loginAccount = async (formData) => {
		"use server";
		const rawFormData = {
			email: formData.get("email"),
			password: formData.get("password"),
			rememberMe: formData.get("rememberMe"),
		};

		const res = await fetchurl(`/auth/login`, "POST", "no-cache", {
			...rawFormData,
			website: "beFree",
		});

		if (res?.data) {
			redirect(`/auth/validatetwofactorauth/${res?.data?._id}`);
		}

		// If not success, stop
		if (!res?.success) return;

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
		await setAuthTokenOnServer(res?.token);
		const loadUser = await fetchurl(`/auth/me`, "GET", "no-cache");
		await setUserStripeChargesEnabled(
			loadUser?.data?.stripe?.stripeChargesEnabled
		);
		await setUserIdOnServer(loadUser?.data?._id);
		await setUserUsernameOnServer(loadUser?.data?.username);
		await setUserEmailOnServer(loadUser?.data?.email);
		// alert("Login was a success");
		searchParams?.returnpage
			? redirect(searchParams.returnpage)
			: redirect(`/auth/profile`);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form action={loginAccount}>
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
						<br />
						<FormButtons />
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
