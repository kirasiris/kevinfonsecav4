import ConfirmEmailForm from "@/forms/auth/confirmemailform";
import Globalcontent from "@/layout/content";
import Link from "next/link";

const UpdateConfirmEmail = async ({ params, searchParams }) => {
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
