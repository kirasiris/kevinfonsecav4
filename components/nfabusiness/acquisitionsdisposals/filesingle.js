"use client";
import Link from "next/link";

const Single = ({ object = {} }) => {
	return (
		<li className={`list-group-item ${object?._id}`}>
			<Link
				href={{
					pathname: `/noadmin/files/update/${object?._id}`,
					query: {},
				}}
			>
				{object?.location?.filename}
			</Link>
		</li>
	);
};

export default Single;
