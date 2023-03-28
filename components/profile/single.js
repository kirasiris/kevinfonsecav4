import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/blog/loading";

const Single = ({ profile = {}, imageWidth = "168", imageHeight = "168" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`col-lg-3 ${profile._id} mb-3`}>
				<Link
					href={{
						pathname: `/profile/${profile._id}/${profile.username}`,
						query: {
							page: 1,
							limit: 50,
							sort: `-createdAt`,
						},
					}}
					passHref
					legacyBehavior
				>
					<div className="card text-bg-dark">
						<Image
							src={
								profile.cover?.location.secure_location ||
								`https://source.unsplash.com/random/168x168`
							}
							className="card-img-top"
							alt={`${profile.username}'s featured image`}
							width={imageWidth}
							height={imageHeight}
						/>
						<div className="card-img-overlay">
							<h5 className="card-title">{profile.username}</h5>
							<p className="card-text">{profile.bio}</p>
						</div>
					</div>
				</Link>
			</article>
		</Suspense>
	);
};

export default Single;
