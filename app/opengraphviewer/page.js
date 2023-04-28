import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Head from "@/app/head";

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
			<div className="container">
				<div className="row">
					<div className="col-lg-6"></div>
					<div className="col-lg-6"></div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default OpenGraphViewerIndex;
