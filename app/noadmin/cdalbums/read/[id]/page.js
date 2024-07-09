import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import SongList from "@/components/admin/cdalbums/songlist";
import { revalidatePath } from "next/cache";
import UseDropzone from "@/components/admin/cdalbums/songdropzone";
import { notFound } from "next/navigation";

async function getCDAlbum(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getSongs(params) {
	const res = await fetchurl(`/songs${params}`, "GET", "no-cache");
	return res;
}

const ReadCDAlbum = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";

	const cdalbum = await getCDAlbum(`/${params.id}`);
	const songs = await getSongs(
		`?resourceId=${cdalbum?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/songs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/cdalbums/read/${params.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
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
					objectIpRoute={`http://localhost:5000/api/v1/songs`}
					object={cdalbum?.data}
					objectData={{
						resourceId: cdalbum?.data?._id,
						duration: "0:0",
						status: "published",
						averageRating: 5,
						onModel: "Playlist",
					}}
					revalidateUrl={`/noadmin/cdalbums/read/${params.id}`}
				/>
				<div className="card rounded-0">
					<SongList
						allLink={`/noadmin/cdalbums/read/${cdalbum?.data?._id}`}
						pageText="Songs"
						addLink={`/noadmin/cdalbums/song/${cdalbum?.data?._id}/create`}
						searchOn={`/noadmin/cdalbums/read/${cdalbum?.data?._id}`}
						objects={songs}
						searchParams={searchParams}
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
		</div>
	);
};

export default ReadCDAlbum;
