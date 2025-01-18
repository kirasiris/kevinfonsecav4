"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminStatusesMenu = ({
	allLink = "",
	publishedLink = "",
	draftLink = "",
	scheduledLink = "",
	trashedLink = "",
	filledLink = "",
	categoriesLink = "",
	categoryType = "",
}) => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? "active" : "btn-link";
	};

	return (
		<div className="admin-statuses-menu mb-3">
			{allLink !== "" && allLink !== undefined && allLink !== null && (
				<Link
					href={{
						pathname: allLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					passHref
					legacyBehavior
				>
					<a className={`btn ${isActive(allLink)} btn-sm`}>All</a>
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
						<a className={`btn ${isActive(publishedLink)} btn-sm`}>Published</a>
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
					<a className={`btn ${isActive(draftLink)} btn-sm`}>Draft</a>
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
						<a className={`btn ${isActive(scheduledLink)} btn-sm`}>Scheduled</a>
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
						<a className={`btn ${isActive(trashedLink)} btn-sm`}>Trashed</a>
					</Link>
				)}
			{filledLink !== "" && filledLink !== undefined && filledLink !== null && (
				<Link
					href={{
						pathname: filledLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					passHref
					legacyBehavior
				>
					<a className={`btn ${isActive(filledLink)} btn-sm`}>Filled Out</a>
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
