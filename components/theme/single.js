"use client";
import { Suspense } from "react";
import Image from "next/image";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<>Loading themes...</>}>
			<article className={`${object?._id} col-lg-4 mb-4`}>
				<a
					href={`${process.env.NEXT_PUBLIC_ARMED_CODELLC_URL}/theme/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`}
					target="_blank"
					rel="noreferrer noopener"
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
				</a>
			</article>
		</Suspense>
	);
};

export default Single;
