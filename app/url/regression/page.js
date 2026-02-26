import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/url/regression/list";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import CreateShortUrlForm from "@/forms/url/regression/createshorturlform";

async function getUrls(params) {
	const res = await fetchurl(
		`/global/extras/tools/urls/regression${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const UrlRegressionIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const { settings } = await getGlobalData();

	const shorturls = await getUrls(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - URL Regression`}
				description={`Tired of long URLs?. Try to shorten them!`}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/url/regression`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="URL Regression"
						description="Tired of long URLs?. Try to shorten them!"
					/>
					<div className="container">
						<div className="row">
							<Globalcontent containerClasses="col-lg-12">
								<CreateShortUrlForm
									auth={undefined}
									currentpage={`/url/regression?page=${page}&limit=${limit}&sort=${sort}`}
								/>
								<p className="p-3 text-bg-danger">
									Data gets deleted on the 15 of each month
								</p>
								<div className="card rounded-0">
									<List objects={shorturls} searchParams={awtdSearchParams} />
								</div>
							</Globalcontent>
						</div>
					</div>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default UrlRegressionIndex;
