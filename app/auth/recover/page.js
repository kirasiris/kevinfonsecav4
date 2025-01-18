import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";
import Globalcontent from "@/layout/content";
import Link from "next/link";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Recover = async ({ params, searchParams }) => {
	// const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	auth?.data?.isOnline && redirect(`/`);

	const recoverAccount = async (formData) => {
		"use server";
		const rawFormData = {
			email: formData.get("email"),
		};
		await fetchurl(`/auth/forgotpassword`, "POST", "no-cache", {
			...rawFormData,
			website: "beFree",
		});
		// alert(
		// 	`An email has been sent to ${rawFormData.email} associated with this account.`
		// );
		console.log(
			`An email has been sent to ${rawFormData.email} associated with this account.`
		);
		redirect(awtdSearchParams.returnpage || `/auth/login`);
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
							<div className="card-header">Recover</div>
							<div className="card-body">
								<form action={recoverAccount}>
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
									passHref
									legacyBehavior
								>
									<a>Login</a>
								</Link>
								&nbsp;|&nbsp;
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
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default Recover;
