"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<>Loading themes...</>}>
			<article className={`${object?._id} col-lg-4 mb-4`}>
				<Link
					href={{
						pathname: `${process.env.NEXT_PUBLIC_ARMED_CODELLC_URL}/theme/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`,
					}}
				>
					<Image
						src={
							object?.files?.avatar?.location?.secure_location ||
							`https://picsum.photos/1200/900?blur`
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
