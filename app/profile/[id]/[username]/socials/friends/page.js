import { Suspense } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import FriendsList from "@/components/profile/friendslist";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getProfile(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getFriends(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const ProfileFriendsIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getProfilesData = getProfile(`/${params.id}`);

	const limit = searchParams.limit || 50;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSidebarMediasData = getMedias(
		`?user=${params.id}&page=1&limit=9&sort=-createdAt&album=posts${decrypt}`
	);

	const getFriendsData = getFriends(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=-createdAt`
	);

	const [profile, sidebarphotos, friends] = await Promise.all([
		getProfilesData,
		getSidebarMediasData,
		getFriendsData,
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
					<FriendsList
						object={profile}
						objects={friends}
						searchParams={searchParams}
					/>
				</div>
			</div>
		</Suspense>
	);
};

export default ProfileFriendsIndex;
