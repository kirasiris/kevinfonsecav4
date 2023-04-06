import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/comment/loading";

const Single = ({
	author = {},
	comment = {},
	commentId = null,
	imageWidth = "64",
	imageHeight = "64",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${comment._id || commentId}`}>
				<div
					className="d-flex my-4"
					id={`media comment-${comment._id || commentId}`}
				>
					<div className="flex-shrink-0">
						<Link
							href={`/profile/${comment.user._id}/${comment.user.username}`}
							passHref
							legacyBehavior
						>
							<Image
								src={
									comment.user.avatar?.location.secure_location ||
									`https://source.unsplash.com/random/64x64`
								}
								alt={`${comment.user.username}'s featured image`}
								width={imageWidth}
								height={imageHeight}
							/>
						</Link>
					</div>
					<div className="flex-grow-1 ms-3">
						<p>{comment.text}</p>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
