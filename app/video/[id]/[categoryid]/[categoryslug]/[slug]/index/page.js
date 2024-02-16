import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getPlaylists(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/playlists${params}`);
	return res.json();
}

async function getPlaylistChapters(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/videos${params}&sort=-orderingNumber`
	);

	return res.json();
}

const VideoIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getPlaylistsData = getPlaylists(`/${params.id}`);
	const getPlaylistChaptersData = getPlaylistChapters(
		`?resourceId=${params.id}&onModel=Playlist`
	);

	const [playlist, chapters] = await Promise.all([
		getPlaylistsData,
		getPlaylistChaptersData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={playlist.data.title} />
			<List
				object={playlist}
				objects={chapters}
				isAdmin={false}
				params={params}
				searchParams={searchParams}
				isIndex={true}
				linkToShare={`localhost:3000/video/${playlist?.data?._id}`}
				postType="playlist"
				onModel="Playlist"
			/>
		</Suspense>
	);
};

export default VideoIndex;
