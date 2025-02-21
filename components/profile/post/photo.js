"use client";
import Image from "next/image";
import { Carousel } from "react-bootstrap";

const Photo = ({ object = {} }) => {
	return object.files.length === 1 ? (
		<Image
			src={object.files[0].location.secure_location}
			alt={`post's id image`}
			className="p-0 d-block w-100"
			width={450}
			height={450}
			style={{ objectFit: "cover", height: "max-content" }}
		/>
	) : (
		<Carousel>
			{object.files.map((img, index) => (
				<Carousel.Item key={img._id} className={index}>
					<Image
						src={img.location.secure_location}
						alt={`post's id image`}
						className="p-0 d-block w-100"
						width={450}
						height={450}
						style={{ objectFit: "cover" }}
					/>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default Photo;
