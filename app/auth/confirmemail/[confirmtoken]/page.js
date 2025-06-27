// import { fetchurl } from "@/helpers/setTokenOnServer";
// import { redirect } from "next/navigation";
// import FormButtons from "@/components/global/formbuttons";
// import ConfirmEmailForm from "@/forms/auth/confirmemailform";
import Globalcontent from "@/layout/content";
import Link from "next/link";

const UpdateConfirmEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	// const confirmAccount = async (formData) => {
	// 	"use server";
	// 	const confirmtoken = awtdParams.confirmtoken;
	// 	if (!confirmtoken) {
	// 		console.log("There was an error, plase try again");
	// 		redirect(`/auth/login`);
	// 	}
	// 	const rawFormData = {
	// 		email: formData.get("email"),
	// 	};
	// 	await fetchurl(
	// 		`/auth/confirmemail/${confirmtoken}`,
	// 		"PUT",
	// 		"no-cache",
	// 		rawFormData
	// 	);
	// 	redirect(`/auth/login`);
	// };

	return (
		<>
			<style>
				<style>
					{`
					footer: {
						margin-top: 0px !important;
					}
				`}
				</style>
			</style>
			<div
				className="container align-content-center"
				style={{
					height: "100vh",
				}}
			>
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						<div className="card">
							<div className="card-header">Confirm Account</div>
							<div className="card-body">
								<ConfirmEmailForm />
								{/* <form action={confirmAccount}>
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										id="email"
										name="email"
										type="email"
										className="form-control"
										placeholder="john@doe.com"
									/>
									<FormButtons />
								</form> */}
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
										pathname: `/auth/register`,
										query: {},
									}}
								>
									Register
								</Link>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default UpdateConfirmEmail;
