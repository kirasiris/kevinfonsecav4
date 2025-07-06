import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import VideoList from "@/components/noadmin/movies/videolist";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getMovie(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getVideo(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	return res;
}

const ReadMovie = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const movie = await getMovie(`/${awtdParams.id}`);
	const videos = await getVideo(`?resourceId=${movie?.data?._id}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/videos/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/songs/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/songs/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/movies/read/${awtdParams.id}`);
	};
	return (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{movie?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={movie?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<VideoList
						allLink={`/noadmin/movies/read/${movie?.data?._id}`}
						pageText="Videos"
						addLink={`/noadmin/movies/video/${movie?.data?._id}/create`}
						searchOn={`/noadmin/movies/read/${movie?.data?._id}`}
						objects={videos}
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
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							movie?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${movie?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadMovie;
