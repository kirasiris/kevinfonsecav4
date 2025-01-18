import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";

const UpdateConfirmEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const confirmAccount = async (formData) => {
		"use server";
		const confirmtoken = awtdParams.confirmtoken;
		if (!confirmtoken) {
			// alert("There was an error, please try again");
			console.log("There was an error, plase try again");
			redirect(`/auth/login`);
		}
		const rawFormData = {
			email: formData.get("email"),
		};
		await fetchurl(
			`/auth/confirmemail/${confirmtoken}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/auth/login`);
	};

	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<form action={confirmAccount}>
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
						<FormButtons />
					</form>
				</div>
			</div>
		</div>
	);
};

export default UpdateConfirmEmail;
