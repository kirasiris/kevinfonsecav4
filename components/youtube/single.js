"use client";
import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import DisplayYoutubeInfoModal from "./displayyoutubeinfomodal";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<li id={object?._id} className="list-group-item">
				<Link
					href={{
						pathname: `/youtube/watch/${object?._id}/${object?.videoId}`,
						query: {},
					}}
					style={{
						marginBottom: "1rem",
					}}
				>
					{object.title}-{object?.videoId}
				</Link>
				<br />
				<br />
				<div className="btn-group mb-2">
					<button className="btn btn-secondary btn-sm" type="button">
						<i aria-hidden className="fas fa-thumbs-up me-1" />
						{object.likes}
					</button>
					<button className="btn btn-secondary btn-sm" type="button">
						<i aria-hidden className="fas fa-thumbs-down me-1" />
						{object.dislikes}
					</button>
					<button className="btn btn-secondary btn-sm" type="button">
						<i aria-hidden className="fas fa-tag me-1" />
						{object.category}
					</button>
					<button className="btn btn-secondary btn-sm" type="button">
						<i aria-hidden className="fas fa-eye me-1" />
						{object.views}
					</button>
				</div>
				<audio
					controls
					style={{
						width: "100%",
						backgroundColor: "#000000",
					}}
				>
					<source src={object.audioOnly.url} />
				</audio>
				<a
					href={object.videoToDownload.url}
					className="btn btn-secondary btn-sm"
					download
					rel="noopener noreferrer"
				>
					Download Video
				</a>
				<DisplayYoutubeInfoModal object={object} />
			</li>
		</Suspense>
	);
};

export default Single;
