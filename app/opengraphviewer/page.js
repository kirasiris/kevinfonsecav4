import Header from "@/layout/header";
import Head from "@/app/head";
import OpenGraphViewerPage from "@/components/opengraphviewer/opengraphviewerpage";

const OpenGraphViewerIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	return (
		<>
			<Head
				title="Preview Social Media Share and Generate Metatags"
				description="The Easiest Way to Preview and Generate Open Graph Meta Tags. Try the Free Meta Tag Generator and preview all Open Graph meta tags in one place. Website!."
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
