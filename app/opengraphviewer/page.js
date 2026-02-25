import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/opengraphviewer/loading";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import OpenGraphViewerPage from "@/components/opengraphviewer/opengraphviewerpage";
import { getGlobalData } from "@/helpers/globalData";

const OpenGraphViewerIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Open Graph Viewer`}
				description={settings.data.text}
				favicon={settings.data.favicon}
				postImage={settings?.data?.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/opengraphviewer`}
				author={settings.data.author}
				createdAt={settings.data.createdAt}
				updatedAt={settings.data.updatedAt}
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<Header
						title="Preview Social Media Share and Generate Metatags"
						description="The Easiest Way to Preview and Generate Open Graph Meta Tags. Try the Free Meta Tag Generator and preview all Open Graph meta tags in one place. Website!."
					/>
					<OpenGraphViewerPage searchParams={awtdSearchParams} />
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default OpenGraphViewerIndex;
