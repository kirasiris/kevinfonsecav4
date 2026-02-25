import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import Jumbotron from "@/components/profile/jumbotron";
import Map from "@/components/profile/map";
import Sidebar from "@/components/profile/sidebar";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getProfile(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getPosts(params) {
	const res = await fetchurl(`/global/posts${params}`, "GET", "no-cache");
	return res;
}

const ProfileMapIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const limit = awtdSearchParams.limit || 50;
	const page = awtdSearchParams.page || 1;
	const sort = "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const auth = await getUserOnServer();

	const profile = await getProfile(`/${awtdParams.id}`);

	const posts = await getPosts(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&postType=post&subType=maps`,
	);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${profile.data.username}`}
				description={profile.data.bio}
				favicon={settings?.data?.favicon}
				postImage={
					profile.data.files.avatar.location.secure_location ||
					`https://source.unsplash.com/random/416x416`
				}
				imageWidth="416"
				imageHeight="416"
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/profile/${profile.data._id}/${profile.data.username}`}
				author={profile.data.name}
				createdAt={profile.data.createdAt}
				updatedAt={profile.data.updatedAt}
				locales=""
				posType="user"
			/>
			{settings?.data?.maintenance === false ? (
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
							<Sidebar object={profile} />
							<Globalcontent>
								<div className="card">
									<div className="card-header">
										Addresses entered by {profile.data.username} on his/her
										posts
									</div>
									<div className="card-body p-0">
										<Map objects={posts} />
									</div>
									{auth?.userId !== undefined && (
										<div className="card-footer">
											<Link
												href={{
													pathname: `/profile/${auth?.userId}/${auth?.username}/map`,
													query: {},
												}}
											>
												Check yours!
											</Link>
										</div>
									)}
								</div>
							</Globalcontent>
						</div>
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ProfileMapIndex;
