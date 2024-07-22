"use client";
import { Suspense } from "react";
import Loading from "@/app/blog/loading";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";

const GalleryList = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<Tabs defaultActiveKey="video">
				<Tab eventKey="video" title="Video">
					{object.videoEmbedUrl !== "" &&
					object.videoEmbedUrl !== undefined &&
					object.videoEmbedUrl !== null ? (
						<>
							<div className="ratio ration-16x9">
								<iframe src={object.videoEmbedUrl} />
							</div>
							<a
								href={object.videoFetchedUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-link btn-sm"
							>
								Original Video: {object.videoFetchedUrl}
							</a>
						</>
					) : (
						<p>Nothing to show</p>
					)}
				</Tab>
				<Tab eventKey="gallery" title="Gallery">
					{object.thumbnails.length > 0 ? (
						<Carousel>
							{object.thumbnails.map((thumbnail, index) => (
								<Carousel.Item key={index}>
									xD
									{/* <Image src={thumbnail} className="d-block w-100" /> */}
								</Carousel.Item>
							))}
						</Carousel>
					) : (
						<p>Nothing to show</p>
					)}
				</Tab>
			</Tabs>
		</Suspense>
	);
};

export default GalleryList;
