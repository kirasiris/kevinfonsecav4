import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Loading from "@/app/thankyou/loading";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getUserAndSubscribeToCourse(id = "") {
	const res = await fetchurl(
		`/extras/stripe/subscriptions/courses/${id}/paid`,
		"PUT",
		"no-cache",
		{
			resourceId: id,
			status: "published",
			onModel: "Course",
			isPaid: true,
			website: "beFree",
		},
	);
	return res;
}

const ThankYouRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { auth, settings } = await getGlobalData();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(
			`/auth/login?returnpage=/thankyou/${awtdParams.id}/course/${awtdParams.userid}?returnpage=${searchParams.returnpage}`,
		);

	await getUserAndSubscribeToCourse(awtdParams.id);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Thank You`}
				description={"Thank you for your purchase"}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/thankyou/${awtdParams.id}/course/${awtdParams.userid}`}
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
											Thank&nbsp;You&nbsp;for&nbsp;your&nbsp;Purchase!
										</h1>
										<p className="lead">
											You&nbsp;are&nbsp;now&nbsp;able&nbsp;to&nbsp;access&nbsp;to&nbsp;your&nbsp;course!
										</p>
										<hr />
										<Link
											href={`${searchParams.returnpage}`}
											className="btn btn-light btn-sm w-100"
										>
											Access&nbsp;to&nbsp;It!
										</Link>
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
