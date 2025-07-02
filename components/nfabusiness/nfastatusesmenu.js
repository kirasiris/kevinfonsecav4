"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NFAStatusesMenu = ({
	allLink = "",
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
						Published
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
						Draft
					</Link>
				)}
		</div>
	);
};

export default NFAStatusesMenu;
