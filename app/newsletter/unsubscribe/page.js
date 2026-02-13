import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NewsletterForm from "@/components/global/newsletter";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function RemoveEmailFromNewsletters(email = "") {
	const res = await fetchurl(
		`/global/newslettersubscribers/${email}/permanently`,
		"DELETE",
		"no-cache",
		{
			website: "beFree",
		},
	);
	return res;
}

const UnsubscribeFromNewsletter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	await RemoveEmailFromNewsletters(awtdSearchParams.email);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Unsubscribe`}
				description={"Unsubscribe from newsletter"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/blog`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
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
									You&nbsp;have&nbsp;successfully&nbsp;unsubscribed!
								</h1>
								<p className="lead">
									Thank&nbsp;You&nbsp;for&nbsp;being&nbsp;part&nbsp;of&nbsp;the&nbsp;Community!
								</p>
								<hr />
								<Link href={`/`} className="btn btn-light btn-sm w-100">
									Home
								</Link>
								<hr />
								<p className="text-bg-dark text-center text-uppercase">
									If&nbsp;you&nbsp;want&nbsp;to&nbsp;subcribe&nbsp;again,&nbsp;just&nbsp;type&nbsp;your&nbsp;name&nbsp;and&nbsp;email&nbsp;below!
								</p>
								<NewsletterForm
									sectionClassList="text-bg-dark text-center pt-3 pb-3"
									headingClassList=""
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default UnsubscribeFromNewsletter;
