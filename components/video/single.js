import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/video/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	object = {},
	fullWidth = false,
	imageWidth = "415",
	imageHeight = "207",
}) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object._id} ${fullWidth ? "col" : "col-lg-6"}`}>
				<div className={`card ${object.featured && "text-bg-primary"} mb-4`}>
					<Link
						href={`/object/${object._id}/${object?.category?._id}/${object?.category?.slug}/${object.slug}`}
						passHref
						legacyBehavior
					>
						<Image
							src={
								object.files?.avatar?.location.secure_location ||
								`https://source.unsplash.com/random/415x207`
							}
							className="card-img-top"
							alt={`${object.title}'s featured image`}
							width={imageWidth}
							height={imageHeight}
						/>
					</Link>
					<div className="card-body">
						<div className="small text-muted">{object.createdAt}</div>
						<h2 className="card-title">
							<Link
								href={`/object/${object._id}/${object?.category?._id}/${object?.category?.slug}/${object.slug}`}
							>
								{object.title}
							</Link>
						</h2>
						<p className="card-text">
							{typeof object.text === "object" ? (
								"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
							) : (
								<ParseHtml text={JSON.stringify(object.text)} />
							)}
						</p>
						<Link
							href={`/object/${object._id}/${object?.category?._id}/${object?.category?.slug}/${object.slug}`}
							passHref
							legacyBehavior
						>
							<a className="btn btn-sm btn-secondary">Read more</a>
						</Link>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
