import Header from "@/layout/header";
import Head from "@/app/head";
import YouTubePage from "@/components/youtube/youtubepage";
import { getGlobalData } from "@/helpers/globalData";

const YouTubeIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={`${settings?.data?.title} - YTDownloader`}
				description="An actual good YouTube videos downloader, totally for free!."
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/youtube`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
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
