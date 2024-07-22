import YouTubePage from "@/components/youtube/youtubepage";

const AdminYouTubeIndex = async ({ params, searchParams }) => {
	return <YouTubePage searchParams={searchParams} pushTo={false} />;
};

export default AdminYouTubeIndex;
