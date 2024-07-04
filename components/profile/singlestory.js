// import { Suspense } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Loading from "@/app/profile/loading";

// const SingleStory = ({
// 	object = {},
// 	imageWidth = "850",
// 	imageHeight = "350",
// }) => {
// 	return (
// 		<Suspense fallback={<Loading />}>
// 			<article className={`${object?._id} single-story`}>
// 				<Link href={`#!`} passHref legacyBehavior>
// 					<Image
// 						src={
// 							object?.avatar?.location.secure_location ||
// 							`https://source.unsplash.com/random/110x175`
// 						}
// 						className="me-1"
// 						alt={`${object?.title || "Untitled"}'s featured image`}
// 						width={imageWidth}
// 						height={imageHeight}
// 					/>
// 				</Link>
// 			</article>
// 		</Suspense>
// 	);
// };

// export default SingleStory;
