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
