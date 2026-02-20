import { redirect } from "next/navigation";
import Link from "next/link";
import Globalcontent from "@/layout/content";
import RecoverForm from "@/forms/auth/recoverform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const Recover = async ({ params, searchParams }) => {
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
				title={`${settings?.data?.title} - Recover`}
				description={"Recover account"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/recover`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
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
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default Recover;
