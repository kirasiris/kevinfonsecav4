"use client";
import YouTubePage from "@/components/youtube/youtubepage";

const AdminYouTubeIndex = ({ searchParams }) => {
	return <YouTubePage searchParams={searchParams} pushTo={false} />;
};

export default AdminYouTubeIndex;
