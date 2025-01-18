import { Suspense } from "react";
import Header from "@/layout/header";
import Loading from "@/app/blog/loading";
import { fetchurl } from "@/helpers/setTokenOnServer";
import List from "@/components/chapter/list";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getPlaylists(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getPlaylistChapters(params) {
	const res = await fetchurl(
		`/videos${params}&sort=-orderingNumber`,
		"GET",
		"no-cache"
	);
	return res;
}

const VideoIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

	const getPlaylistsData = getPlaylists(`/${awtdParams.id}`);
	const getPlaylistChaptersData = getPlaylistChapters(
		`?resourceId=${awtdParams.id}&onModel=Playlist`
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
				params={awtdParams}
				searchParams={awtdSearchParams}
				isIndex={true}
				linkToShare={`/video/${playlist?.data?._id}`}
				postType="playlist"
				onModel="Playlist"
			/>
		</Suspense>
	);
};

export default VideoIndex;
