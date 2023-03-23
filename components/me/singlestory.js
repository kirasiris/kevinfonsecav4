import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/blog/loading";

const SingleStory = ({
	story = {},
	imageWidth = "850",
	imageHeight = "350",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${story._id} single-story`}>
				<Link href={`#!`} passHref legacyBehavior>
					<Image
						src={
							story.avatar?.location.secure_location ||
							`https://source.unsplash.com/random/110x175`
						}
						className="me-1"
						alt={`${story.title}'s featured image`}
						width={imageWidth}
						height={imageHeight}
					/>
				</Link>
			</article>
		</Suspense>
	);
};

export default SingleStory;
