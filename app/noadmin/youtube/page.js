import YouTubePage from "@/components/youtube/youtubepage";

const AdminYouTubeIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	return <YouTubePage searchParams={awtdSearchParams} pushTo={false} />;
};

export default AdminYouTubeIndex;
