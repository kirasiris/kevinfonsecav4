"use client";
import Link from "next/link";

const AdminStatusesMenu = ({
	allLink = "",
	publishedLink = "",
	draftLink = "",
	scheduledLink = "",
	trashedLink = "",
	categoriesLink = "",
	categoryType = "",
}) => {
	return (
		<div
			className="mb-3"
			style={{
				padding: "0.5rem 1rem",
				backgroundColor: "#f8f8f8",
				border: "1px solid rgba(0, 0, 0, 0.175)",
			}}
		>
			{allLink !== "" && allLink !== undefined && allLink !== null && (
				<Link
					href={{
						pathname: allLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
			)}
			{publishedLink !== "" &&
				publishedLink !== undefined &&
				publishedLink !== null && (
					<Link
						href={{
							pathname: publishedLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">Published</a>
					</Link>
				)}
			{draftLink !== "" && draftLink !== undefined && draftLink !== null && (
				<Link
					href={{
						pathname: draftLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
			)}
			{scheduledLink !== "" &&
				scheduledLink !== undefined &&
				scheduledLink !== null && (
					<Link
						href={{
							pathname: scheduledLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">Scheduled</a>
					</Link>
				)}
			{trashedLink !== "" &&
				trashedLink !== undefined &&
				trashedLink !== null && (
					<Link
						href={{
							pathname: trashedLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm">Trashed</a>
					</Link>
				)}
			{categoriesLink !== "" &&
				categoriesLink !== undefined &&
				categoriesLink !== null &&
				categoryType !== "" &&
				categoryType !== undefined &&
				categoryType !== null && (
					<Link
						href={{
							pathname: categoriesLink,
							query: { page: 1, limit: 10, categoryType: categoryType },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm border-1 border-secondary">
							Categories
						</a>
					</Link>
				)}
		</div>
	);
};

export default AdminStatusesMenu;
