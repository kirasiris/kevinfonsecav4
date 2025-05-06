import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ChapterList from "@/components/admin/animes/chapterlist";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import UseDropzone from "@/components/admin/animes/chapterdropzone";
import { notFound } from "next/navigation";

async function getAnime(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getChapters(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadAnime = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const anime = await getAnime(`/${awtdParams.id}`);
	const chapters = await getChapters(
		`?resourceId=${anime?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/deleteall`, "PUT", "no-cache", {
			onModel: "Playlist",
		});
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/videos/deleteall/permanently`,
			"DELETE",
			"no-cache",
			{
				onModel: "Playlist",
			}
		);
		revalidatePath(`/noadmin/animes/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{anime?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={anime?.data?.text} />
					</div>
				</div>
				<UseDropzone
					auth={auth}
					token={token}
					id={"file"}
					name={"file"}
					multipleFiles={false}
					onModel="Playlist"
					objectIpRoute={`${process.env.apiUrl}/videos`}
					object={anime?.data}
					objectData={{
						resourceId: anime?.data?._id,
						duration: "0:0",
						status: "draft",
						averageRating: 10,
						onModel: "Playlist",
					}}
					revalidateUrl={`/noadmin/animes/read/${awtdParams.id}`}
				/>
				<div className="card rounded-0">
					<ChapterList
						allLink={`/noadmin/animes/read/${anime?.data?._id}`}
						pageText="Episodes"
						addLink={`/noadmin/animes/chapter/${anime?.data?._id}/create`}
						searchOn={`/noadmin/animes/read/${anime?.data?._id}`}
						objects={chapters}
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
							anime?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${anime?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadAnime;
