import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/profile/loading";

const Single = ({ object = {}, imageWidth = "130", imageHeight = "130" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<Link
				href={{
					pathname: `/profile/${object?.user?._id}/${object?.user?.username}/photos/${object?._id}`,
					query: {},
				}}
				passHref
				legacyBehavior
			>
				<a className="col">
					<Image
						src={
							object?.location?.secure_location ||
							`https://source.unsplash.com/random/150x150`
						}
						width={150}
						height={150}
						alt={`${object?.user?.username || "Username"}'s profile avatars`}
						style={{
							objectFit: "cover",
							margin: "1px",
						}}
					/>
				</a>
			</Link>
		</Suspense>
	);
};

export default Single;
