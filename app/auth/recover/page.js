import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import RecoverForm from "@/forms/auth/recoverform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const Recover = async ({ params, searchParams }) => {
	// const awtdParams = await params;
	const awtdSearchParams = await searchParams;

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
								<RecoverForm />
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

export default Recover;
