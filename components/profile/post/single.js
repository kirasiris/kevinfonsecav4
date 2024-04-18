"use client";
import { Suspense } from "react";
import Loading from "@/app/profile/loading";
import ExportModal from "@/components/global/exportmodal";
import SingleCardHeader from "./postdata/header";
import Audio from "./audio";
import Map from "./map";
import Text from "./text";
import File from "./file";
import Photo from "./photo";
import Video from "./video";
import Default from "./default";

const Post = ({ object = {} }) => {
	const images = ["https://source.unsplash.com/random/1200x900"];

	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id} mb-3`}>
				<div className="card">
					<SingleCardHeader object={object} />
					<div
						className={`card-body ${
							(object?.files?.length >= 1 || images?.length >= 1) && `p-0`
						}`}
					>
						{object.subType === "audios" ? (
							<Audio object={object} />
						) : object.subType === "files" ? (
							<File object={object} />
						) : object.subType === "maps" ? (
							<Map object={object} />
						) : object.subType === "photos" ? (
							<Photo object={object} />
						) : object.subType === undefined ? (
							<Default object={object} />
						) : object.subType === "text" ? (
							<Text object={object} />
						) : object.subType === "videos" ? (
							<Video object={object} />
						) : (
							<Default object={object} />
						)}
					</div>
					<div className="card-footer">
						<div className="float-end">
							<ExportModal object={object} />
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Post;
