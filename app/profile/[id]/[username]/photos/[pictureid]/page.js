import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/profile/sidebar";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import ArticleHeader from "@/components/global/articleheader";
import Jumbotron from "@/components/profile/jumbotron";

async function getProfile(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getMedias(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const ProfilePhotoRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getUserOnServer();

	const getProfilesData = getProfile(`/${awtdParams.id}`);

	const getMediasData = getMedias(`/${awtdParams.pictureid}`);

	const getSidebarMediasData = getMedias(
		`?user=${awtdParams.id}&page=1&limit=9&sort=-createdAt&album=posts`
	);

	const [profile, file, sidebarphotos] = await Promise.all([
		getProfilesData,
		getMediasData,
		getSidebarMediasData,
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
	);
};

export default ProfilePhotoRead;
