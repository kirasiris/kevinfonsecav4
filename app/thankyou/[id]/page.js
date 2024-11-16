import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getVerification(params) {
	const res = await fetchurl(
		`/extras/stripe/accounts/verification${params}`,
		"PUT",
		"no-cache"
	);
	return res;
}

const ThankYouRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const auth = await getAuthenticatedUser();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login?returnpage=/thankyou/${awtdParams.id}`);

	await getVerification(`/${awtdParams.id}`);

	return (
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
	);
};

export default ThankYouRead;
