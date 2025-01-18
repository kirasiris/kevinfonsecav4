import { Suspense } from "react";
import Link from "next/link";
import { calculateTimeSincePublished } from "befree-utilities";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	object = {},
	fullWidth = false,
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<li
				className="list-group-item"
				style={{
					marginRight: "4px",
					marginLeft: "12px",
				}}
			>
				<div className="float-start">
					<Link
						href={{
							pathname: `/forum/${object._id}/${object.category}/${object.sub_category}/${object.slug}`,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">{object.title}</a>
					</Link>
				</div>
				<div className="float-end">
					<span className="badge bg-secondary me-1">
						{object.views}&nbsp;Views
					</span>
					<span className="badge bg-secondary me-1">
						{calculateTimeSincePublished(object.createdAt)}
					</span>
				</div>
			</li>
		</Suspense>
	);
};

export default Single;
