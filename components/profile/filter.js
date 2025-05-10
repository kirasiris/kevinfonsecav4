"use client";
import Link from "next/link";

const Filter = ({ params = {} }) => {
	return (
		<div
			className="btn-group mt-3 mb-3"
			role="group"
			aria-label="Basic example"
		>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt" },
				}}
				className="btn btn-secondary btn-sm"
			>
				All
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "text" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Text
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "photos" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Photos
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "videos" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Videos
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "audios" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Audios
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "files" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Files
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "maps" },
				}}
				className="btn btn-secondary btn-sm"
			>
				Maps
			</Link>
		</div>
	);
};

export default Filter;
