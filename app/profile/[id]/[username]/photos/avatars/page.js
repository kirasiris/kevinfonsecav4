import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import PicturesList from "@/components/profile/pictureslist";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";

async function getProfile(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const ProfilePhotoAvatarsIndex = async ({ params, searchParams }) => {
	const auth = await getUserOnServer();

	const getProfilesData = getProfile(`/${params.id}`);

	const limit = searchParams.limit || 50;
	const page = searchParams.page || 1;
	const sort = "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSidebarMediasData = getMedias(
		`?user=${params.id}&page=1&limit=9&sort=${sort}&album=posts${decrypt}`
	);

	const getMediasData = getMedias(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=${sort}&album=profile-avatars${decrypt}`
	);

	const [profile, sidebarphotos, files] = await Promise.all([
		getProfilesData,
		getSidebarMediasData,
		getMediasData,
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
					<PicturesList
						object={profile}
						objects={files}
						searchParams={searchParams}
					/>
				</div>
			</div>
		</Suspense>
	);
};

export default ProfilePhotoAvatarsIndex;
