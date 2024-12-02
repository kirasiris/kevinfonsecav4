import { Suspense } from "react";
import Link from "next/link";
import { formatDateWithoutTime } from "befree-utilities";
import Loading from "@/app/blog/loading";

const Single = ({
	object = {},
	fullWidth = false,
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id}`}>
				<div className="card mb-4">
					<div className="card-body">
						<div className="small text-muted">
							{formatDateWithoutTime(object?.createdAt)}
						</div>
						<h5 className="card-title">
							<Link href={`/job/${object?._id}/${object?.slug}`}>
								{object?.title}
							</Link>
						</h5>
						<hr />
						<Link
							href={`/job/${object?._id}/${object?.slug}`}
							passHref
							legacyBehavior
						>
							<a className="btn btn-sm btn-secondary">Read&nbsp;more</a>
						</Link>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
