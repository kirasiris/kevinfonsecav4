import Header from "@/layout/header";
import Head from "@/app/head";
import OpenGraphViewerPage from "@/components/opengraphviewer/opengraphviewerpage";

const OpenGraphViewerIndex = async ({ searchParams }) => {
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
			<OpenGraphViewerPage searchParams={searchParams} />
		</>
	);
};

export default OpenGraphViewerIndex;
