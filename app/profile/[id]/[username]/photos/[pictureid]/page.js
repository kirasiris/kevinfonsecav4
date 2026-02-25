import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/profile/sidebar";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import Jumbotron from "@/components/profile/jumbotron";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getProfile(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ProfilePhotoRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	const getProfilesData = getProfile(`/${awtdParams.id}`);

	const getMediasData = getMedias(`/${awtdParams.pictureid}`);

	const [profile, file] = await Promise.all([getProfilesData, getMediasData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${profile.data.username}'s ${file.data.title} Photo`}
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
				url={`/profile/${profile.data._id}/${profile.data.username}/photos/${file.data._id}`}
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
								<article>
									<ArticleHeader object={file} />
									<figure className="mb-4">
										<Image
											src={file.data.location.secure_location}
											width={file.data.dimensions.width}
											height={file.data.dimensions.height}
											alt={`${profile.data.username}'s photo`}
											style={{
												width: "100%",
												height: "auto",
											}}
											priority
										/>
									</figure>
									<section className="mb-5">
										<ParseHtml text={file?.data?.text} />
										<hr />
										<div className="float-start">
											<ExportModal
												linkToShare={`localhost:3000/profile/${profile?.data?._id}/${profile?.data?.username}/photos/${file?.data?._id}`}
												object={file?.data}
											/>
										</div>
										<div className="float-end">
											<ReportModal
												postId={file?.data?._id}
												postType="file"
												onModel="File"
											/>
										</div>
										<div style={{ clear: "both" }} />
										<AuthorBox author={profile?.data} />
										{/* HERE GOES THE COMMENTS */}
									</section>
								</article>
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

export default ProfilePhotoRead;
