import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getUserAndSubscribeToCourse(id = "") {
	const res = await fetchurl(
		`/extras/stripe/subscriptions/memberships/${id}/paid`,
		"PUT",
		"no-cache",
		{
			resourceId: id,
			status: "published",
			onModel: "Membership",
			isPaid: true,
			website: "beFree",
		}
	);
	return res;
}

const ThankYouRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(
			`/auth/login?returnpage=/thankyou/${awtdParams.id}/membership/${awtdParams.userid}?returnpage=${searchParams.returnpage}`
		);

	await getUserAndSubscribeToCourse(awtdParams.id);

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
									Thank&nbsp;You&nbsp;for&nbsp;your&nbsp;Purchase!
								</h1>
								<p className="lead">
									You&nbsp;are&nbsp;now&nbsp;able&nbsp;to&nbsp;access&nbsp;to&nbsp;your&nbsp;course!
								</p>
								<hr />
								<Link
									href={`${searchParams.returnpage}`}
									passHref
									legacyBehavior
								>
									<a className="btn btn-light btn-sm w-100">
										Access&nbsp;to&nbsp;It!
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default ThankYouRead;
