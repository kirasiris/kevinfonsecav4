import Link from "next/link";

const Filter = ({ params = {} }) => {
	return (
		<div className="btn-group mb-3" role="group" aria-label="Basic example">
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">All</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "text" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Text</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "photos" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Photos</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "videos" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Videos</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "audios" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Audios</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "files" },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-secondary btn-sm">Files</a>
			</Link>
			<Link
				href={{
					pathname: `/profile/${params.id}/${params.username}`,
					query: { page: 1, limit: 10, subType: "maps" },
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
