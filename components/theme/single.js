import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/theme/loading";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id} col-lg-4 mb-4`}>
				<Link
					href={{
						pathname: `/theme/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`,
					}}
				>
					<Image
						src={
							object?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/1200x900`
						}
						className="img-thumbnail"
						alt={`${object?.title || "Untitled"}'s featured image`}
						width={`1200`}
						height={`900`}
					/>
				</Link>
			</article>
		</Suspense>
	);
};

export default Single;
