import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/url/regression/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getShortUrls(params) {
	const res = await fetchurl(
		`/global/extras/tools/urls/regression${params}&postType=short`,
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

	const getShortUrlsData = getShortUrls(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const [shorturls] = await Promise.all([getShortUrlsData]);

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
					<List objects={shorturls} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default UrlRegressionIndex;
