"use client";

import Image from "next/image";
import Link from "next/link";

const SingleCardHeader = ({ object = {} }) => {
	return (
		<div className="card-header">
			<div className="float-start">
				<Link
					href={{
						pathname: `/profile/${object.user._id}/${object.user.username}`,
						query: {
							page: 1,
							limit: 50,
							sort: "-createdAt",
						},
					}}
					passHref
					legacyBehavior
				>
					<a>
						<Image
							src={object.user.files.avatar.location.secure_location}
							className="me-3"
							width={35}
							height={35}
							alt={`${object.user.username}'s avatar`}
							style={{
								objectFit: "cover",
							}}
						/>
					</a>
				</Link>
			</div>
			<div className="float-end">END</div>
		</div>
	);
};
export default SingleCardHeader;
