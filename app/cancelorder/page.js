import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loading from "@/app/cancelorder/loading";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const CancelOrderRead = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login?returnpage=/cancelorder`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Cancel Order`}
				description={"Sorry my products were not of your liking"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/cancelorder`}
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
											I&apos;m&nbsp;sorry&nbsp;our&nbsp;services and/or
											products&nbsp;were&nbsp;not&nbsp;of&nbsp;your&nbsp;liking.
										</h1>
										<p className="lead">
											Please,&nbsp;let&nbsp;me&nbsp;know&nbsp;what&nbsp;was&nbsp;wrong&nbsp;with&nbsp;it&nbsp;by&nbsp;sending&nbsp;a
											message&nbsp;via&nbsp;our&nbsp;
											<Link href={`/contact`} className="btn btn-light btn-sm">
												contact page
											</Link>
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

export default CancelOrderRead;
