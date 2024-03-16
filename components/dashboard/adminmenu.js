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
				<li className={`list-group-item ${isActive(`/dashboard/courses`)}`}>
					<Link
						href={{
							pathname: "/dashboard/courses",
							query: {
								page: 1,
								limit: 10,
								sortby: "-createdAt",
							},
						}}
						passHref
						legacyBehavior
					>
						<a>Courses</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default AdminMenu;
