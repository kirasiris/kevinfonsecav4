import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Head from "@/app/head";
import YouTubePage from "@/components/youtube/youtubepage";

const LiveCodeIndex = async ({ searchParams }) => {
	return (
		<>
			<Head
				title="YTDownloader"
				description="An actual good YouTube videos downloader, totally for free!."
			/>
			<Header
				title="YTDownloader"
				description="An actual good YouTube videos downloader, totally for free!."
			/>
			<YouTubePage searchParams={searchParams} />
			<Footer />
		</>
	);
};

export default LiveCodeIndex;
