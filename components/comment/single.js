import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/comment/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	auth = {},
	object = {},
	commentId = null,
	imageWidth = "64",
	imageHeight = "64",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id || commentId}`}>
				<div
					className="d-flex my-4"
					id={`media comment-${object?._id || commentId}`}
				>
					<div className="flex-shrink-0">
						<Link
							href={`/profile/${object?.user?._id}/${object?.user?.username}`}
							passHref
							legacyBehavior
						>
							<Image
								src={
									object?.user.files?.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/64x64`
								}
								alt={`${object?.user?.username || "Username"}'s featured image`}
								width={imageWidth}
								height={imageHeight}
								className="div-hover"
							/>
						</Link>
					</div>
					<div className="flex-grow-1 ms-3">
						<Link
							href={`/comment/${object?._id}/${object?.slug}`}
							passHref
							legacyBehavior
						>
							{object.title || "Untitled"}
						</Link>
						&nbsp;by&nbsp;{object?.user?.username || "Username"}
						<ParseHtml text={object.text} />
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
