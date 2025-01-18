import { Suspense } from "react";
import Loading from "@/app/blog/loading";

const Single = ({ object = {} }) => {
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
