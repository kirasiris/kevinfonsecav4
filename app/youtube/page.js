import Header from "@/layout/header";
import Head from "@/app/head";
import YouTubePage from "@/components/youtube/youtubepage";

const YouTubeIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	return (
		<>
			<Head
				title="YTDownloader"
				description="An actual good YouTube videos downloader, totally for free!."
			/>
			<Header
				title="YTDownloader"
				description="An actual good YouTube videos downloader, totally for free!."
				headerStyle={{
					marginBottom: "0px !important",
				}}
			/>
			<YouTubePage
				searchParams={awtdSearchParams}
				pushTo={true}
				pushToLink={`/youtube`}
			/>
		</>
	);
};

export default YouTubeIndex;
