import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";
import { formatDateWithoutTime } from "@/helpers/utilities";

const Single = ({
	object = {},
	fullWidth = false,
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<li className={`list-group-item`}>
				<a target="_blank" rel="noreferrer noopener" href={object.shortUrl}>
					{object.title}
				</a>
			</li>
		</Suspense>
	);
};

export default Single;
