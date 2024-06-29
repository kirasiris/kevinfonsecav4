import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ChapterList from "@/components/admin/animes/chapterlist";
import { revalidatePath } from "next/cache";
import Image from "next/image";

async function getAnime(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getChapters(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadAnime = async ({ params, searchParams }) => {
	const anime = await getAnime(`/${params.id}`);
	const chapters = await getChapters(
		`?resourceId=${anime?.data?._id}&page=${searchParams.page || 1}&limit=${
			searchParams.limit || 10
		}&sort=${searchParams.sort || "orderingNumber"}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall`, "PUT", "no-cache", {
			onModel: "Playlist",
		});
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/videos/deleteall/permanently`, "DELETE", "no-cache", {
			onModel: "Playlist",
		});
		revalidatePath(`/noadmin/animes/read/${params.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{anime?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={anime?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<ChapterList
						allLink={`/noadmin/animes/read/${anime?.data?._id}`}
						pageText="Episodes"
						addLink={`/noadmin/animes/chapter/${anime?.data?._id}/create`}
						searchOn={`/noadmin/animes/read/${anime?.data?._id}`}
						objects={chapters}
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
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
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
