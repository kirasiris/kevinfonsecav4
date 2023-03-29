import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/comment/loading";

const Single = ({
	comment = {},
	resourceId = {},
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${comment._id}`}></article>
		</Suspense>
	);
};

export default Single;
