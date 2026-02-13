import Header from "@/layout/header";
import Head from "@/app/head";
import OpenGraphViewerPage from "@/components/opengraphviewer/opengraphviewerpage";
import { getGlobalData } from "@/helpers/globalData";

const OpenGraphViewerIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Open Graph Viewer`}
				description="The Easiest Way to Preview and Generate Open Graph Meta Tags. Try the Free Meta Tag Generator and preview all Open Graph meta tags in one place. Website!."
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/opengraphviewer`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title="Preview Social Media Share and Generate Metatags"
				description="The Easiest Way to Preview and Generate Open Graph Meta Tags. Try the Free Meta Tag Generator and preview all Open Graph meta tags in one place. Website!."
			/>
			<OpenGraphViewerPage searchParams={awtdSearchParams} />
		</>
	);
};

export default OpenGraphViewerIndex;
