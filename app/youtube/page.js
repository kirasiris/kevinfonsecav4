import Header from "@/layout/header";
import YouTubePage from "@/components/youtube/youtubepage";

const YouTubeIndex = async ({ searchParams }) => {
	return (
		<>
			<Header
				title="YTDownloader"
				description="An actual good YouTube videos downloader, totally for free!."
				headerStyle={{
					marginBottom: "0px !important",
				}}
			/>
			<YouTubePage searchParams={searchParams} pushTo={true} />
		</>
	);
};

export default YouTubeIndex;
