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
						<p className="card-text">
							{object?.experience_level}
							{object?.job_type.map((value, index) => value)}
							{object?.remote}
							{object?.shift_and_schedule.map((value, index) => value)}
							{object?.encouraged_to_apply}
							{object?.starting_at}
							{object?.provides_training.toString()}
							{object?.security_clearance.toString()}
						</p>
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
