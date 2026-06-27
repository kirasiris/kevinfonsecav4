import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import { getGlobalData } from "@/helpers/globalData";
import AlbumMediaManager from "@/components/noadmin/cdalbums/albummediamanager";

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
	const { auth } = await getGlobalData();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const cdalbum = await getCDAlbum(`/${awtdParams.id}`);
	const songs = await getSongs(
		`?resourceId=${cdalbum?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-1">
					<div className="card-header">
						{cdalbum?.data?.title || "Untitled"}
					</div>
					<div className="card-body">
						<ParseHtml text={cdalbum?.data?.text} />
					</div>
				</div>
				<AlbumMediaManager
					auth={auth}
					token={token}
					object={cdalbum?.data}
					objects={songs}
					searchParams={awtdSearchParams}
				/>
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
