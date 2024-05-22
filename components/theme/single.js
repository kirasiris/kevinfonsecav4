import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/theme/loading";

const Single = ({ theme = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${theme?._id} col-lg-4 mb-4`}>
				<Link
					href={{
						pathname: `/theme/${theme?._id}/${theme?.category?._id}/${theme?.category?.slug}/${theme?.slug}`,
					}}
					passHref
					legacyBehavior
				>
					<Image
						src={
							theme?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/1200x900`
						}
						className="card-img-top div-hover"
						alt={`${theme?.title || "Untitled"}'s featured image`}
						width={`850`}
						height={`350`}
					/>
				</Link>
			</article>
		</Suspense>
	);
};

export default Single;
