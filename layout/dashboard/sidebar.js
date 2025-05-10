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
					<Link href={"/dashboard"}>Dashboard</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/companies`)}`}>
					<Link
						href={{
							pathname: "/dashboard/companies",
							query: {},
						}}
					>
						Companies
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
					>
						Courses
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/events`)}`}>
					<Link
						href={{
							pathname: "/dashboard/events",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Events
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/files`)}`}>
					<Link
						href={{
							pathname: "/dashboard/files",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Files
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/forums`)}`}>
					<Link
						href={{
							pathname: "/dashboard/forums",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Forums
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/jobs`)}`}>
					<Link
						href={{
							pathname: "/dashboard/jobs",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Jobs
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
					>
						Memberships
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(`/dashboard/notifications`)}`}
				>
					<Link
						href={{
							pathname: "/dashboard/notifications",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Notifications
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/posts`)}`}>
					<Link
						href={{
							pathname: "/dashboard/posts",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Posts
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/realstates`)}`}>
					<Link
						href={{
							pathname: "/dashboard/realstates",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Real States
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/resumes`)}`}>
					<Link
						href={{
							pathname: "/dashboard/resumes",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Resumes
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/revenue`)}`}>
					<Link
						href={{
							pathname: "/dashboard/revenue",
							query: {},
						}}
					>
						Revenue
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/snippets`)}`}>
					<Link
						href={{
							pathname: "/dashboard/snippets",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Snippets
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/users`)}`}>
					<Link
						href={{
							pathname: "/dashboard/users",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Users
					</Link>
				</li>
				<li className={`list-group-item ${isActive(`/dashboard/weapons`)}`}>
					<Link
						href={{
							pathname: "/dashboard/weapons",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Weapons
					</Link>
				</li>
				<li
					className={`list-group-item ${isActive(`/dashboard/workrequests`)}`}
				>
					<Link
						href={{
							pathname: "/dashboard/workrequests",
							query: {
								page: 1,
								limit: 10,
								sort: "-createdAt",
							},
						}}
					>
						Work Requests
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
					>
						Courses Enrolled
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
					>
						Memberships Enrolled
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminMenu;
