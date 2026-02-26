import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/url/extender/list";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import CreateLongUrlForm from "@/forms/url/extender/createlongurlform";

async function getUrls(params) {
	const res = await fetchurl(
		`/global/extras/tools/urls/extender${params}&postType=long`,
		"GET",
		"no-cache",
	);
	return res;
}

const UrlExtenderIndex = async ({ params, searchParams }) => {
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
				title={`${settings?.data?.title} - URL Extender`}
				description={`Tired of short URLs?. Try to extend them!`}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/url/extender`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="URL Extender"
						description="Tired of short URLs?. Try to extend them!"
					/>
					<div className="container">
						<div className="row">
							<Globalcontent containerClasses="col-lg-12">
								<CreateLongUrlForm
									auth={undefined}
									currentpage={`/url/extender?page=${page}&limit=${limit}&sort=${sort}`}
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

export default UrlExtenderIndex;
