"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NFAStatusesMenu = ({
	allLink = "",
	publishedLink = "",
	draftLink = "",
	scheduledLink = "",
	trashedLink = "",
	filledLink = "",
	categoriesLink = "",
	categoryType = "",
	acquiredLink = "",
	disposedLink = "",
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
					className={`btn ${isActive(allLink)} btn-sm`}
				>
					All
				</Link>
			)}{" "}
			{publishedLink !== "" &&
				publishedLink !== undefined &&
				publishedLink !== null && (
					<Link
						href={{
							pathname: publishedLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						className={`btn ${isActive(publishedLink)} btn-sm`}
					>
						Published
					</Link>
				)}
			{draftLink !== "" && draftLink !== undefined && draftLink !== null && (
				<Link
					href={{
						pathname: draftLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					className={`btn ${isActive(draftLink)} btn-sm`}
				>
					Draft
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
						className={`btn ${isActive(scheduledLink)} btn-sm`}
					>
						Scheduled
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
						className={`btn ${isActive(trashedLink)} btn-sm`}
					>
						Trashed
					</Link>
				)}
			{filledLink !== "" && filledLink !== undefined && filledLink !== null && (
				<Link
					href={{
						pathname: filledLink,
						query: { page: 1, limit: 10, sort: `-createdAt` },
					}}
					className={`btn ${isActive(filledLink)} btn-sm`}
				>
					Filled Out
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
						className="btn btn-link btn-sm border-1 border-secondary"
					>
						Categories
					</Link>
				)}
			{acquiredLink !== "" &&
				acquiredLink !== undefined &&
				acquiredLink !== null && (
					<Link
						href={{
							pathname: acquiredLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						className={`btn ${isActive(acquiredLink)} btn-sm`}
					>
						Acquired
					</Link>
				)}
			{disposedLink !== "" &&
				disposedLink !== undefined &&
				disposedLink !== null && (
					<Link
						href={{
							pathname: disposedLink,
							query: { page: 1, limit: 10, sort: `-createdAt` },
						}}
						className={`btn ${isActive(disposedLink)} btn-sm`}
					>
						Disposed
					</Link>
				)}
		</div>
	);
};

export default NFAStatusesMenu;
