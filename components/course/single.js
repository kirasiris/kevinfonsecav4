import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/course/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {}, imageWidth = "415", imageHeight = "207" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object._id} col`}>
				<div className={`card ${object.featured && "text-bg-primary"} mb-4`}>
					<div className="course-image"></div>
					<div className="course-content"></div>
					<Link
						href={`/course/${object._id}/${object?.category}/${object?.sub_category}/${object.slug}/index`}
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
								href={`/course/${object._id}/${object?.category}/${object?.sub_category}/${object.slug}/index`}
							>
								{object.title}
							</Link>
						</h2>
						<Link
							href={`/course/${object._id}/${object?.category}/${object?.sub_category}/${object.slug}/index`}
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