"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/profile/loading";
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";
import ExportModal from "@/components/global/exportmodal";
import { DropdownButton, Button } from "react-bootstrap";
import Waveform from "@/layout/waveform";

const Photo = ({ object = {} }) => {
	const images = ["https://source.unsplash.com/random/1200x900"];

	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id} mb-3`}>
				<div className="card">
					<div className="card-header">AUTHOR</div>
					<div
						className={`card-body ${
							(object?.media?.length >= 1 || images?.length >= 1) && `p-0`
						}`}
					>
						{console.log("Photo post", object)}
					</div>
					<div className="card-footer">
						<div className="float-end">
							<ExportModal object={object} />
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Photo;
