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
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">All</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "text" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Text</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "photos" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Photos</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "videos" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Videos</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "audios" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Audios</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "files" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Files</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, sort: "-createdAt", subType: "maps" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Maps</a>
			</Link>
		</div>
	);
};

export default Filter;
