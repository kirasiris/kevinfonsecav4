"use client";
import { Suspense } from "react";
import Loading from "@/app/blog/loading";
import RelatedCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

const RelatedList = ({ object = {} }) => {
	const responsive = {
		superLargeDesktop: {
			// the naming can be any, depends on you.
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	return (
		<Suspense fallback={<Loading />}>
			<>
				<h6>Related ({object?.related_videos?.length})...</h6>
				<RelatedCarousel responsive={responsive}>
					{object?.related_videos.map((related, index) => (
						<div key={index}>
							<a
								href={`https://www.youtube.com/watch?v=${related.id}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Image
									src={related.thumbnails[related.thumbnails.length - 1].url}
									className="p-1"
									alt={`${related.author.name}'s thumbnail`}
									title={related.title}
									width={0}
									height={0}
									style={{ width: "100%", height: "auto" }} // optional
								/>
							</a>
							<br />
							{related.author && (
								<>
									<a
										href={related.author.channel_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Image
											src={
												related.author.thumbnails[
													related.author.thumbnails.length - 1
												].url
											}
											className="mt-2 mb-1 me-1"
											alt={`${related.author.name}'s thumbnail`}
											title={related.author.name}
											width={0}
											height={0}
											style={{ width: "45px", height: "auto" }}
										/>
										{related.author.name}
									</a>
									<br />
								</>
							)}

							<a
								href={`https://www.youtube.com/watch?v=${related.id}`}
								target="_blank"
								rel="noreferrer noopener"
							>
								{related.title}
							</a>
						</div>
					))}
				</RelatedCarousel>
			</>
		</Suspense>
	);
};

export default RelatedList;
