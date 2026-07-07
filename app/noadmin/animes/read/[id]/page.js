import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ChapterList from "@/components/noadmin/animes/chapterlist";
import UseDropzone from "@/components/noadmin/animes/chapterdropzone";
import { getGlobalData } from "@/helpers/globalData";
import ChaptersMediaManager from "@/components/noadmin/animes/chaptersmediamanager";

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
	const { auth } = await getGlobalData();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const anime = await getAnime(`/${awtdParams.id}`);
	const chapters = await getChapters(
		`?resourceId=${anime?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-1">
					<div className="card-header">{anime?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={anime?.data?.text} />
					</div>
				</div>
				<ChaptersMediaManager
					auth={auth}
					token={token}
					object={anime?.data}
					objects={chapters}
					searchParams={awtdSearchParams}
				/>
				{/* <UseDropzone
					auth={auth}
					token={token}
					id={"file"}
					name={"file"}
					multipleFiles={true}
					object={anime?.data}
				/> */}
				{/* <div className="card rounded-0">
					<ChapterList
						allLink={`/noadmin/animes/read/${anime?.data?._id}`}
						pageText="Episodes"
						addLink={`/noadmin/animes/chapter/${anime?.data?._id}/create`}
						searchOn={`/noadmin/animes/read/${anime?.data?._id}`}
						searchedKeyword=""
						object={anime?.data}
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
				</div> */}
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
