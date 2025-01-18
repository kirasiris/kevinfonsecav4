import Header from "@/layout/header";
import YouTubePage from "@/components/youtube/youtubepage";

const YouTubeIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	return (
		<>
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
