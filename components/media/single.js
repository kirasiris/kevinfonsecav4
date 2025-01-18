// import { Suspense } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Loading from "@/app/blog/loading";

// const Single = ({ media = {}, imageWidth = "168", imageHeight = "168" }) => {
// 	return (
// 		<Suspense fallback={<Loading />}>
// 			<article className={`${media._id}`}>
// 				<Link
// 					href={{
// 						pathname: `/profiles/${media?.user?.username}/photos/${media?._id}`,
// 						query: {
// 							page: 1,
// 							limit: 50,
// 							sort: `-createdAt`,
// 						},
// 					}}
// 					passHref
// 					legacyBehavior
// 				>
// 					<a>
// 						<Image
// 							src={
// 								media?.location.secure_location ||
// 								`https://source.unsplash.com/random/168x168`
// 							}
// 							alt={`${media?.user?.username}'s image`}
// 							width={imageWidth}
// 							height={imageHeight}
// 						/>
// 					</a>
// 				</Link>
// 			</article>
// 		</Suspense>
// 	);
// };

// export default Single;
