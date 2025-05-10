import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDateWithoutTime } from "befree-utilities";
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
			<article className={`${object?._id} ${fullWidth ? "col" : "col-lg-6"}`}>
				<div className={`card ${object?.featured && "text-bg-primary"} mb-4`}>
					<Link
						href={`/blog/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`}
					>
						<Image
							src={
								object?.files?.avatar?.location.secure_location ||
								`https://source.unsplash.com/random/415x207`
							}
							className="card-img-top"
							alt={`${object?.title || "Untitled"}'s featured image`}
							width={imageWidth}
							height={imageHeight}
						/>
					</Link>
					<div className="card-body">
						<div className="small text-muted">
							{formatDateWithoutTime(object?.createdAt)}
						</div>
						<h2 className="card-title">
							<Link
								href={`/blog/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`}
							>
								{object?.title || "Untitled"}
							</Link>
						</h2>

						{typeof object?.text === "object" ? (
							"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
						) : (
							<ParseHtml text={object?.text} classList="card-text" />
						)}
						<hr />
						<Link
							href={`/blog/${object?._id}/${object?.category?._id}/${object?.category?.slug}/${object?.slug}`}
							className="btn btn-sm btn-secondary"
						>
							Read&nbsp;more
						</Link>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
