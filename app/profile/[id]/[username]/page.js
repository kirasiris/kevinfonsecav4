import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import List from "@/components/profile/list";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getProfile(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getFeaturedPosts(params) {
	const res = await fetchurl(`/posts${params}`, "GET", "no-cache");
	return res;
}

async function getPosts(params) {
	const res = await fetchurl(`/posts${params}`, "GET", "no-cache");
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const ProfileRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getProfilesData = getProfile(`/${params.id}`);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const subtype = searchParams.subType
		? `&subType=${searchParams.subType}`
		: "";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getStoriesData = getPosts(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=story`
	);

	const getFeaturedPostsData = getFeaturedPosts(
		`?user=${params.id}&featured=true&status=published${decrypt}`
	);

	const getPostsData = getPosts(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=post${subtype}${decrypt}`
	);

	const getMediasData = getMedias(`?user=${params.id}&limit=9&album=posts`);

	const [profile, stories, featured, posts, photos] = await Promise.all([
		getProfilesData,
		getStoriesData,
		getFeaturedPostsData,
		getPostsData,
		getMediasData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Jumbotron
				object={profile}
				headerStyle={{
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						profile?.data?.files?.cover?.location.secure_location ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			/>
			<div className="container">
				<div className="row">
					<Sidebar object={profile} objects={photos} />
					<List
						object={profile}
						stories={stories}
						featured={featured}
						objects={posts}
						params={params}
						searchParams={searchParams}
					/>
				</div>
			</div>
		</Suspense>
	);
};

export default ProfileRead;
