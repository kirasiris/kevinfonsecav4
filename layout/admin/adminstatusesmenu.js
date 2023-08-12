"use client";
import Link from "next/link";

const AdminStatusesMenu = ({
	allLink = "",
	publishedLink = "",
	draftLink = "",
	scheduledLink = "",
	trashedLink = "",
}) => {
	return (
		<div className="bg-body-secondary mb-3 p-1">
			<Link
				href={{
					pathname: allLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">All</a>
			</Link>
			<Link
				href={{
					pathname: publishedLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Published</a>
			</Link>
			<Link
				href={{
					pathname: draftLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Draft</a>
			</Link>
			<Link
				href={{
					pathname: scheduledLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Scheduled</a>
			</Link>
			<Link
				href={{
					pathname: trashedLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm">Trashed</a>
			</Link>
		</div>
	);
};

export default AdminStatusesMenu;
