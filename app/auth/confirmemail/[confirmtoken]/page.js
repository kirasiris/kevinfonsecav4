import Link from "next/link";
import ConfirmEmailForm from "@/forms/auth/confirmemailform";
import Globalcontent from "@/layout/content";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const UpdateConfirmEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;

	const { settings } = await getGlobalData();

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
				title={`${settings?.data?.title} - Confirm Email`}
				description={"Confirm email to activate account"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/confirmemail/${awtdParams.confirmtoken}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
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
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default UpdateConfirmEmail;
