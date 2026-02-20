/**
 *
 * LOGIN PAGE IS THE ONLY THAT SHOULD NOT BE BLOCKED BY MAINTENANCE
 * ADMIN SHOULD BE ABLE TO ACCESS TO IT TO DISABLE IT ONCE MAINTENANCE HAS BEEN DONE OR WHILE ITS TAKING PLACE
 *
 *
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import Globalcontent from "@/layout/content";
import LoginForm from "@/forms/auth/loginform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const Login = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

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
			<Head
				title={`${settings?.data?.title} - Login`}
				description={"Access your account"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/login`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div
				className="container align-content-center"
				style={{
					height: "100vh",
				}}
			>
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						<div className="card">
							<div className="card-header">Login</div>
							<div className="card-body">
								<LoginForm />
							</div>
							<div className="card-footer">
								<Link
									href={{
										pathname: `/auth/register`,
										query: {},
									}}
								>
									Register
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

export default Login;
