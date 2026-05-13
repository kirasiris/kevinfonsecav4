"use client";
import { Suspense } from "react";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<>Loading qrcodes...</>}>
			<li className={`list-group-item`}>
				<a target="_blank" rel="noreferrer noopener" href={object.shortUrl}>
					{object.title}
				</a>
			</li>
		</Suspense>
	);
};

export default Single;
