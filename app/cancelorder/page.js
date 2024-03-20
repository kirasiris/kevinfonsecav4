import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const CancelOrderRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login?returnpage=/cancelorder`);

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
									I&apos;m&nbsp;sorry&nbsp;our&nbsp;services and/or
									products&nbsp;were&nbsp;not&nbsp;of&nbsp;your&nbsp;liking.
								</h1>
								<p className="lead">
									Please,&nbsp;let&nbsp;me&nbsp;know&nbsp;what&nbsp;was&nbsp;wrong&nbsp;with&nbsp;it&nbsp;by&nbsp;sending&nbsp;a
									message&nbsp;via&nbsp;our&nbsp;
									<Link href={`/contact`} passHref legacyBehavior>
										<a className="btn btn-light btn-sm">contact page</a>
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default CancelOrderRead;
