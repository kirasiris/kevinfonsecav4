import Loading from "@/app/blog/loading";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const Single = ({ theme = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article>
				<Link href={`/theme/${theme._id}`} passHref legacyBehavior>
					<Image
						src={
							theme.avatar?.location.secure_location ||
							`https://source.unsplash.com/random/1200x900`
						}
						className="card-img-top"
						alt={`${theme.title}'s featured image`}
						width={`850`}
						height={`350`}
					/>
				</Link>
			</article>
		</Suspense>
	);
};

export default Single;
