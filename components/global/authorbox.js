"use client";
import Image from "next/image";
import Link from "next/link";

const AuthorBox = ({ author = {}, imageWidth = "64", imageHeight = "64" }) => {
	return (
		<div className="d-flex my-4" id={`media comment-${author._id}`}>
			<div className="flex-shrink-0">
				<Link
					href={`/profile/${author._id}/${author.username}`}
					passHref
					legacyBehavior
				>
					<Image
						src={
							author.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/64x64`
						}
						alt={`${author.username}'s featured image`}
						width={imageWidth}
						height={imageHeight}
					/>
				</Link>
			</div>
			<div className="flex-grow-1 ms-3">
				<p>{author.bio}</p>
			</div>
		</div>
	);
};

export default AuthorBox;
