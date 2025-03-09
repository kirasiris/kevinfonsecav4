import {
	fetchurl,
	setAuthTokenOnServer,
	setUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";
import Globalcontent from "@/layout/content";
import Link from "next/link";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Login = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

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

		console.log("Si llego aqui x1", res);

		if (res?.data) {
			redirect(`/auth/validatetwofactorauth/${res?.data?._id}`);
		}

		console.log("Si llego aqui x2", res);

		// If not success, stop
		if (!res?.success) return;

		console.log("Si llego aqui x3", res);

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setAuthToken (client version)
		await setAuthTokenOnServer(res?.token);

		console.log("Si llego aqui x4", res);

		const loadUser = async () => await fetchurl(`/auth/me`, "GET", "default");
		const loadedUser = await loadUser();

		await setUserOnServer(await loadedUser?.data);

		console.log("Si llego aqui x5", res);

		// alert("Login was a success");
		// redirect(awtdSearchParams.returnpage || `/auth/profile`);
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
							<div className="card-header">Login</div>
							<div className="card-body">
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
										placeholder="********"
									/>
									<br />
									<FormButtons />
								</form>
							</div>
							<div className="card-footer">
								<Link
									href={{
										pathname: `/auth/register`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a>Register</a>
								</Link>
								&nbsp;|&nbsp;
								<Link
									href={{
										pathname: `/auth/recover`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a>Forgot password?</a>
								</Link>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default Login;
