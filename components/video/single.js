import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/video/loading";

const Single = ({ object = {}, imageWidth = "415", imageHeight = "207" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article
				className={`${object?._id}`}
				style={{
					width: "213.5px",
				}}
			>
				<div
					className={`card ${object?.featured && "text-bg-primary"} rounded-0`}
					style={{
						width: "213.5",
						height: "262px",
					}}
				>
					<Link
						href={`/video/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}/index`}
					>
						<Image
							src={
								object?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/213.5x262`
							}
							className="card-img-top rounded-0"
							alt={`${object?.title || "Untitled"}'s featured image`}
							width={imageWidth}
							height={imageHeight}
							style={{
								width: "213.5px",
							}}
						/>
					</Link>
					<div className="card-body text-center">
						<h6 className="card-title">
							<Link
								href={`/video/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}/index`}
							>
								{object?.title || "Untitled"}
							</Link>
						</h6>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
