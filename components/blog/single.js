import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/blog/loading";

const Single = ({ blog = {}, imageWidth = "415", imageHeight = "207" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${blog._id} col-lg-6`}>
				<div className={`card ${blog.featured && "text-bg-primary"} mb-4`}>
					<Link
						href={`/blog/${blog._id}/${blog?.category?._id}/${blog?.category?.slug}/${blog.slug}`}
						passHref
						legacyBehavior
					>
						<Image
							src={
								blog.files?.avatar?.location.secure_location ||
								`https://source.unsplash.com/random/415x207`
							}
							className="card-img-top"
							alt={`${blog.title}'s featured image`}
							width={imageWidth}
							height={imageHeight}
						/>
					</Link>
					<div className="card-body">
						<div className="small text-muted">{blog.createdAt}</div>
						<h2 className="card-title">
							<Link
								href={`/blog/${blog._id}/${blog?.category?._id}/${blog?.category?.slug}/${blog.slug}`}
							>
								{blog.title}
							</Link>
						</h2>
						<p className="card-text">
							TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED
						</p>
						<Link
							href={`/blog/${blog._id}/${blog?.category?._id}/${blog?.category?.slug}/${blog.slug}`}
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
