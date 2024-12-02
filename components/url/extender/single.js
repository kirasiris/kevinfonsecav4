import { Suspense } from "react";
import Loading from "@/app/blog/loading";

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
