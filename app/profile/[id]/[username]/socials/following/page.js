import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import FollowingList from "@/components/profile/friendslist";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getProfile(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

async function getFollowings(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

const ProfileFollowingIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getAuthenticatedUser();

	const getProfilesData = getProfile(`/${awtdParams.id}`);

	const limit = awtdSearchParams.limit || 50;
	const page = awtdSearchParams.page || 1;
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSidebarMediasData = getMedias(
		`?user=${awtdParams.id}&page=1&limit=9&sort=-createdAt&album=posts${decrypt}`
	);

	const getFollowingData = getFollowings(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=-createdAt`
	);

	const [profile, sidebarphotos, followings] = await Promise.all([
		getProfilesData,
		getSidebarMediasData,
		getFollowingData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Jumbotron
				object={profile}
				headerStyle={{
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						profile.data?.files?.cover?.location.secure_location ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			/>
			<div className="container">
				<div className="row">
					<Sidebar object={profile} objects={sidebarphotos} />
					<FollowingList objects={followings} searchParams={awtdSearchParams} />
				</div>
			</div>
		</Suspense>
	);
};

export default ProfileFollowingIndex;
