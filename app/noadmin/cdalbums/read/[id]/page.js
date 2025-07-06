import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import SongList from "@/components/noadmin/cdalbums/songlist";
import UseDropzone from "@/components/noadmin/cdalbums/songdropzone";

async function getCDAlbum(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getSongs(params) {
	const res = await fetchurl(`/global/songs${params}`, "GET", "no-cache");
	return res;
}

const ReadCDAlbum = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const cdalbum = await getCDAlbum(`/${awtdParams.id}`);
	const songs = await getSongs(
		`?resourceId=${cdalbum?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/songs/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						{cdalbum?.data?.title || "Untitled"}
					</div>
					<div className="card-body">
						<ParseHtml text={cdalbum?.data?.text} />
					</div>
				</div>
				<UseDropzone
					auth={auth}
					token={token}
					id={"file"}
					name={"file"}
					multipleFiles={false}
					onModel="Playlist"
					objectIpRoute={`${process.env.apiUrl}/songs`}
					object={cdalbum?.data}
					objectData={{
						resourceId: cdalbum?.data?._id,
						duration: "0:0",
						status: "published",
						averageRating: 5,
						onModel: "Playlist",
					}}
					revalidateUrl={`/noadmin/cdalbums/read/${awtdParams.id}`}
				/>
				<div className="card rounded-0">
					<SongList
						allLink={`/noadmin/cdalbums/read/${cdalbum?.data?._id}`}
						pageText="Songs"
						addLink={`/noadmin/cdalbums/song/${cdalbum?.data?._id}/create`}
						searchOn={`/noadmin/cdalbums/read/${cdalbum?.data?._id}`}
						objects={songs}
						searchParams={awtdSearchParams}
						handleDraft={draftIt}
						handlePublish={publishIt}
						handleTrash={trashIt}
						handleSchedule={scheduleIt}
						handleDelete={handleDelete}
						handleTrashAllFunction={handleTrashAll}
						handleDeleteAllFunction={handleDeleteAll}
					/>
				</div>
			</div>
			<div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							cdalbum?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${cdalbum?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCDAlbum;
