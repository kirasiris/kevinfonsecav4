"use client";
import Link from "next/link";

const Single = ({ object = {} }) => {
	console.log(`File x${object?._id}`, object);
	return (
		<li className={`list-group-item ${object?._id}`}>
			<Link
				href={{
					pathname: `/noadmin/files/update/${object?._id}`,
					query: {},
				}}
			>
				{/* <a
					href={object?.location?.secure_location}
					target="_blank"
					rel="noreferrer noopener"
				> */}
				{object?.location?.filename}
				{/* </a> */}
			</Link>
		</li>
	);
};

export default Single;
