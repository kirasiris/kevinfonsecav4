"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminMenu = () => {
	const pathname = usePathname();

	const isActive = (path = "") => {
		return pathname === path ? " active" : "";
	};

	return (
		<div className="col-lg-1 mb-3">
			<ul className="list-group">
				<li className={`list-group-item ${isActive(`/dashboard`)}`}>
					<Link href={"/dashboard"} passHref legacyBehavior>
						<a>Dashboard</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/revenue`)}`}>
					<Link
						href={{
							pathname: "/dashboard/revenue",
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a>Revenue</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/courses`)}`}>
					<Link
						href={{
							pathname: "/dashboard/courses",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
						passHref
						legacyBehavior
					>
						<a>Courses Published</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/dashboard/courses/enrolled`
					)}`}
				>
					<Link
						href={{
							pathname: "/dashboard/courses/enrolled",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
						passHref
						legacyBehavior
					>
						<a>Courses Enrolled</a>
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/memberships`)}`}>
					<Link
						href={{
							pathname: "/dashboard/memberships",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
						passHref
						legacyBehavior
					>
						<a>Memberships Published</a>
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(
						`/dashboard/memberships/enrolled`
					)}`}
				>
					<Link
						href={{
							pathname: "/dashboard/memberships/enrolled",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
						passHref
						legacyBehavior
					>
						<a>Memberships Enrolled</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminMenu;
