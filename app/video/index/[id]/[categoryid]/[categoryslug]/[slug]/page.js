import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Sidebar from "@/layout/video/sidebar";
import Loading from "@/app/blog/loading";
import ExportModal from "@/components/global/exportmodal";
import AuthorBox from "@/components/global/authorbox";
// import CommentBox from "@/components/global/commentbox";
import ParseHtml from "@/layout/parseHtml";
import ReportModal from "@/components/global/reportmodal";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getPlaylists(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/playlists${params}`);
	return res.json();
}

async function getCategories(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/categories${params}`
	);
	return res.json();
}

const VideoMain = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getPlaylistsData = getPlaylists(`/${params.id}`);

	const getCategoriesData = getCategories(`?categoryType=playlist`);

	const [playlist, categories] = await Promise.all([
		getPlaylistsData,
		getCategoriesData,
	]);

	const randomArray = [
		{
			_id: 0,
			title: "Hola",
		},
	];

	return (
		<Suspense fallback={<Loading />}>
			<Header title={playlist.data.title} />
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						<div className="card mb-3">
							<div className="card-header">{playlist.data.title}</div>
							<div className="card-body">
								<ParseHtml text={playlist.data.text} />
							</div>
						</div>
						<div className="card">
							<div className="card-header">Episodes</div>
							<ul
								className="list-group list-group-flush overflow-x-hidden"
								style={{ maxHeight: "1000px" }}
							>
								{Array(100)
									.fill(randomArray)
									.map((i, index) => (
										<li key={index} className="list-group-item">
											<Link
												href={`/video/${index}/hola-${index}`}
												passHref
												legacyBehavior
											>
												<a>{index}</a>
											</Link>
										</li>
									))}
							</ul>
						</div>
						<hr />
						{/* <CommentBox
						user={blog?.data?.user}
						postId={blog?.data?._id}
						secondPostId={blog?.data?._id}
						isVisible={blog?.data?.commented}
						postType="blog"
						onModel="Blog"
					/> */}
					</div>
					<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
						<figure className="mb-3 bg-dark">
							<Image
								className="img-fluid p-3"
								src={
									playlist?.data?.files?.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/260x370`
								}
								alt={`${playlist?.data?.files?.avatar?.location?.filename}'s featured image`}
								width={440}
								height={570}
								priority
							/>
						</figure>
						<button className="btn btn-success w-100">
							{playlist?.data?.onairstatus.toUpperCase()}
						</button>
					</div>
				</div>
			</div>
		</Suspense>
	);
};

export default VideoMain;
