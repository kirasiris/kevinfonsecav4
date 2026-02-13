import Header from "@/layout/header";
import ErrorPage from "@/layout/errorpage";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const APIIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	return settings.data.maintenance === false ? (
		<>
			<Head
				title={`${settings?.data?.title} - API`}
				description={`Learn how to programatically communicate with my DB!`}
				favicon={settings.data.favicon}
				postImage={settings.data.showcase_image}
				imageWidth="800"
				imageHeight="450"
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url="/api"
				author={settings.data.author}
				createdAt={settings.data.createdAt}
				updatedAt={settings.data.updatedAt}
				locales=""
				posType="website"
			/>
			<Header
				title={`${settings.data.title} API`}
				description="Learn how to programatically communicate with my DB!"
			/>
		</>
	) : (
		<ErrorPage />
	);
};

export default APIIndex;
