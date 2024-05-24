import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Recover = async ({ params, searchParams }) => {
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
		searchParams?.returnpage
			? redirect(searchParams.returnpage)
			: redirect(`/auth/login`);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
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
			</div>
		</div>
	);
};

export default Recover;
