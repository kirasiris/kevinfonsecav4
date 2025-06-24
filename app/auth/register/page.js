import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import RegisterForm from "@/forms/auth/registerform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Register = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is logged in
	auth?.data?.isOnline && redirect(`/`);

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
				className="container align-content-center"
				style={{
					height: "100vh",
				}}
			>
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						<div className="card">
							<div className="card-header">Register</div>
							<div className="card-body">
								<RegisterForm />
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
