import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import List from "@/components/profile/list";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";
import { revalidatePath } from "next/cache";
import Globalcontent from "@/layout/content";
import PostNew from "@/components/profile/postnew";
import Head from "@/app/head";

async function getProfile(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getFeaturedPosts(params) {
	const res = await fetchurl(`/global/posts${params}`, "GET", "no-cache");
	return res;
}

async function getPosts(params) {
	const res = await fetchurl(`/global/posts${params}`, "GET", "no-cache");
	return res;
}

// async function getMedias(params) {
// 	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
// 	return res;
// }

const ProfileRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = "-createdAt";
	const subtype = awtdSearchParams.subType
		? `&subType=${awtdSearchParams.subType}`
		: "";
	const decrypt =
		awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "&decrypt=true";

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const profile = await getProfile(`/${awtdParams.id}`);

	const stories = await getPosts(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&postType=story`
	);

	const featured = await getFeaturedPosts(
		`?user=${awtdParams.id}&featured=true&status=published${decrypt}`
	);

	const posts = await getPosts(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&postType=post${subtype}${decrypt}`
	);

	// const photos = await getMedias(`?user=${awtdParams.id}&limit=9&album=posts`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const hideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/hideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const unhideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/unhideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const commentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/commentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	const uncommentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/uncommentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`
		);
	};

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={profile.data.username}
				description={profile.data.bio}
				postImage={
					profile.data.files.avatar.location.secure_location ||
					`https://source.unsplash.com/random/168x168`
				}
				imageWidth="168"
				imageHeight="168"
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
					<Sidebar object={profile} objects={[]} />
					<Globalcontent>
						<PostNew
							auth={auth}
							token={token}
							object={profile}
							params={awtdParams}
							searchParams={awtdSearchParams}
							revalidateUrl={`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`}
						/>
						<List
							auth={auth}
							object={profile}
							stories={stories}
							featured={featured}
							params={awtdParams}
							objects={posts}
							searchParams={awtdSearchParams}
							handleDraft={undefined}
							handlePublish={undefined}
							handleTrash={undefined}
							handleSchedule={undefined}
							handleDelete={handleDelete}
							handleTrashAllFunction={handleTrashAll}
							handleDeleteAllFunction={handleDeleteAll}
							handleFeature={featureIt}
							handleUnfeature={unfeatureIt}
							handleHide={hideIt}
							handleUnhide={unhideIt}
							handleCommented={commentIt}
							handleUncommented={uncommentIt}
						/>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default ProfileRead;
