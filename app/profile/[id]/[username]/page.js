import { Suspense } from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import List from "@/components/profile/list";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";
import Globalcontent from "@/layout/content";
import ErrorPage from "@/layout/errorpage";
import PostNew from "@/components/profile/postnew";
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

	const { settings } = await getGlobalData();

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const profile = await getProfile(`/${awtdParams.id}`);

	const stories = await getPosts(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&postType=story`,
	);

	const featured = await getPosts(
		`?user=${awtdParams.id}&featured=true&status=published${decrypt}`,
	);

	const posts = await getPosts(
		`?user=${awtdParams.id}&page=${page}&limit=${limit}&sort=${sort}&status=published&postType=post${subtype}${decrypt}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/posts/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const hideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/hideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const unhideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/unhideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const commentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/commentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

	const uncommentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/posts/${id}/uncommentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${awtdParams.id}/${awtdParams.username}?page=${page}&limit=${limit}&sort=${sort}${subtype}`,
		);
	};

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
								profile?.data?.files?.cover?.location.secure_location ||
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
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
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
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ProfileRead;
