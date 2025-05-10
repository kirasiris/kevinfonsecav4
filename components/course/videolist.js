"use client";
import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/course/loading";

const VideoList = ({ auth = {}, object = {}, objects = [] }) => {
	return (
		<Suspense fallback={<Loading />}>
			{objects.data.length > 0 ? (
				<ul
					className="list-group list-group-flush overflow-x-hidden"
					style={{ maxHeight: "1073px" }}
				>
					{objects.data.map((lesson, index) => (
						<li
							key={lesson._id}
							className={`${index} list-group-item ${lesson.orderingNumber}`}
						>
							<div className="float-start">
								<Link
									href={`/course/${object.data._id}/${object.data.category}/${object.data.sub_category}/${object.data.slug}/video/${lesson._id}`}
								>
									<span className="badge bg-secondary me-1">
										{lesson.orderingNumber}
									</span>
									{lesson.title}
								</Link>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="alert alert-danger rounded-0  m-0 border-0">
					Nothing&nbsp;found
				</div>
			)}
		</Suspense>
	);
};

export default VideoList;
