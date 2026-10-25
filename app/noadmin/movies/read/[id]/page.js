import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import VideosMediaManager from "@/components/noadmin/movies/videosmediamanager";
import { getGlobalData } from "@/helpers/globalData";

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

	const token = await getAuthTokenOnServer();
	const { auth } = await getGlobalData();

	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const movie = await getMovie(`/${awtdParams.id}`);
	const videos = await getVideo(
		`?resourceId=${movie?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="row">
			<div className="col-lg-8">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{movie?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={movie?.data?.text} />
					</div>
				</div>
				<VideosMediaManager
					auth={auth}
					token={token}
					object={movie?.data}
					objects={videos}
					searchParams={awtdSearchParams}
				/>
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
