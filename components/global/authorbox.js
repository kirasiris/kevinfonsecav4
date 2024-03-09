"use client";
import ParseHtml from "@/layout/parseHtml";
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
							author.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/64x64`
						}
						alt={`${author.username}'s featured image`}
						width={imageWidth}
						height={imageHeight}
						className="img-hover"
					/>
				</Link>
			</div>
			<div className="flex-grow-1 ms-3">
				<Link
					href={`/profile/${author._id}/${author.username}`}
					passHref
					legacyBehavior
				>
					{author.username}
				</Link>
				<ParseHtml text={author?.text} />
			</div>
		</div>
	);
};

export default AuthorBox;
