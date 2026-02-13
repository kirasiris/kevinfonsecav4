"use client";
import Image from "next/image";
import Link from "next/link";

const PictureSingle = ({ object = {} }) => {
	console.log("object", object);
	return (
		<Link
			href={{
				pathname: `/profile/${object.user._id}/${object.user.username}/photos/${object._id}`,
				query: {},
			}}
		>
			<Image
				src={object.location.secure_location}
				alt={`post's id image`}
				className="p-0"
				width={450}
				height={450}
				style={{ objectFit: "cover", height: "max-content" }}
			/>
		</Link>
	);
};

export default PictureSingle;
