import { Suspense } from "react";
import { redirect } from "next/navigation";
import Loading from "@/app/thankyou/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getVerification(params) {
	const res = await fetchurl(
		`/extras/stripe/accounts/verification${params}`,
		"PUT",
		"no-cache",
	);
	return res;
}

const ThankYouRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { auth, settings } = await getGlobalData();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login?returnpage=/thankyou/${awtdParams.id}`);

	await getVerification(`/${awtdParams.id}`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Thank You`}
				description={"Thank you for settin up your on boarding process"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/thankyou/${awtdParams.id}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<div
						className="bg-secondary py-5"
						style={{
							marginBottom: "-24px",
						}}
					>
						<div className="container">
							<div className="row my-5">
								<div className="col-lg-12">
									<div className="text-white text-center">
										<h1 className="fw-bolder">
											Thank&nbsp;You&nbsp;for&nbsp;Setting&nbsp;Up&nbsp;Your&nbsp;On&nbsp;Boarding&nbsp;Process!
										</h1>
										<p className="lead">
											This&nbsp;is&nbsp;the&nbsp;most&nbsp;important&nbsp;step&nbsp;for&nbsp;you&nbsp;to&nbsp;be&nbsp;able&nbsp;to&nbsp;get&nbsp;paid
											after&nbsp;publishing&nbsp;courses,&nbsp;memberships&nbsp;and&nbsp;more!
										</p>
										<p className="lead">
											Without&nbsp;it,&nbsp;you&nbsp;would&nbsp;not&nbsp;have&nbsp;been&nbsp;authorized&nbsp;to&nbsp;earn&nbsp;an
											income!
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ThankYouRead;
