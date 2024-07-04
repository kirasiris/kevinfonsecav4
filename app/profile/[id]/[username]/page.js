import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserEmailOnServer,
	getUserIdOnServer,
	getUserUsernameOnServer,
} from "@/helpers/setTokenOnServer";
import Loading from "@/app/profile/loading";
import List from "@/components/profile/list";
import Sidebar from "@/components/profile/sidebar";
import Jumbotron from "@/components/profile/jumbotron";
import { revalidatePath } from "next/cache";
import Globalcontent from "@/layout/content";
import PostNew from "@/components/profile/postnew";

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

// async function getMedias(params) {
// 	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
// 	return res;
// }

const ProfileRead = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const userId = await getUserIdOnServer();
	const username = await getUserUsernameOnServer();
	const email = await getUserEmailOnServer();

	const auth = {
		id: userId?.value,
		username: username?.value,
		email: email?.value,
		token: token?.value,
	};

	const profile = await getProfile(`/${params.id}`);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const subtype = searchParams.subType
		? `&subType=${searchParams.subType}`
		: "";
	const decrypt =
		searchParams.decrypt === "true" ? "&decrypt=true" : "&decrypt=true";

	const stories = await getPosts(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=story`
	);

	const featured = await getFeaturedPosts(
		`?user=${params.id}&featured=true&status=published${decrypt}`
	);

	const posts = await getPosts(
		`?user=${params.id}&page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=post${subtype}${decrypt}`
	);

	// const photos = await getMedias(`?user=${params.id}&limit=9&album=posts`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/blogs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const featureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/featureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const unfeatureIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/unfeatureit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const hideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/hideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const unhideIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/unhideit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const commentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/commentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

	const uncommentIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/posts/${id}/uncommentit`, "PUT", "no-cache");
		revalidatePath(
			`/profile/${params.id}/${params.username}?page=${
				searchParams.page || 1
			}&limit=${searchParams.limit || 100}&sort=${
				searchParams.sort || `-createdAt`
			}${(searchParams.subType && `&subType=${searchParams.subType}`) || ""}`
		);
	};

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
					<Sidebar object={profile} objects={[]} />
					<Globalcontent>
						<PostNew
							auth={auth}
							object={profile}
							params={params}
							searchParams={searchParams}
						/>
						<List
							auth={auth}
							object={profile}
							stories={stories}
							featured={featured}
							params={params}
							objects={posts}
							searchParams={searchParams}
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
