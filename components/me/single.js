import Loading from "@/app/blog/loading";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const Single = ({ post = {} }) => {
	const Gallery = (images = [], text = "") => {
		return images.length > 1 ? (
			<div className="carousel" style={{ position: "sticky" }}>
				{true
					? images.slice(0, 5).map((image, index) => (
							<div key={index} className="carousel-item">
								<Image src={image} alt={`${post._id}'s gallery`} />
							</div>
					  ))
					: images.map((image, index) => (
							<div className="carousel-item">
								<Image src={image} alt={`${post._id}'s gallery`} />
							</div>
					  ))}
			</div>
		) : images.length === 1 ? (
			<Image
				src={images[0]}
				alt={`${post._id}'s gallery`}
				className="p-0 d-block w-100"
				width={"auto"}
				height={`auto`}
				style={{ objectFit: "fit" }}
			/>
		) : (
			<p>{text}</p>
		);
	};
	return (
		<Suspense fallback={<Loading />}>
			<article>
				<div className="card">
					<div className={`card-body ${post.media.length >= 1 && "p-0"}`}>
						<Gallery
							media={post.media}
							text={`TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED`}
						/>
					</div>
					<div className="card-footer p-1">
						<Link
							href={{
								pathname: `/post/${post._id}`,
							}}
						></Link>
						<div className="float-right">{post.createdAt}</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
