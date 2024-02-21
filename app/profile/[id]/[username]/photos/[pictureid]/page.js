import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/components/profile/sidebar";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
// import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

async function getProfile(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/users${params}`);
	return res.json();
}

async function getMedias(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/files${params}`);
	return res.json();
}

const ProfilePictureRead = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	const getProfilesData = getProfile(`/${params.id}`);

	const getMediasData = getMedias(`/${params.pictureid}`);

	const getSidebarMediasData = getMedias(
		`?user=${params.id}&page=1&limit=9&sort=-createdAt&album=posts`
	);

	const [profile, file, sidebarphotos] = await Promise.all([
		getProfilesData,
		getMediasData,
		getSidebarMediasData,
	]);

	console.log(file);

	return (
		<Suspense fallback={<Loading />}>
			<Header
				title={profile.data.username}
				description={profile.data.bio}
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
								{/* <CommentBox
										auth={auth.data}
										user={blog?.data?.user}
										postId={blog?.data?._id}
										secondPostId={blog?.data?._id}
										isVisible={blog?.data?.commented}
										postType="blog"
										onModel="Blog"
									/> */}
							</section>
						</article>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default ProfilePictureRead;
