"use client";
import { Suspense } from "react";
import Link from "next/link";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<>Loading qrcodes...</>}>
			<li className={`list-group-item`}>
				<Link
					href={{
						pathname: `/qrcode/${object._id}`,
						query: {},
					}}
				>
					{object.title}
				</Link>
			</li>
		</Suspense>
	);
};

export default Single;
