"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu = ({ object = {} }) => {
	const pathname = usePathname();
	const isActive = (path = "") => {
		return pathname === path ? " active text-bg-secondary" : " text-bg-dark";
	};

	return (
		<div className="bg-dark mb-4">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<nav className="nav">
							<Link
								href={{
									pathname: `/course/${object?.data?._id}/${object?.data?.category}/${object?.data?.sub_category}/${object?.data?.slug}/index`,
									query: {},
								}}
								className={`nav-link${isActive(
									`/course/${object?.data?._id}/${object?.data?.category}/${object?.data?.sub_category}/${object?.data?.slug}/index`
								)}`}
							>
								Overview
							</Link>
							<Link
								href={{
									pathname: `/course/${object?.data?._id}/students`,
									query: {
										page: 1,
										limit: 10,
										sort: `-createdAt`,
									},
								}}
								className={`nav-link${isActive(
									`/course/${object?.data?._id}/students`
								)}`}
							>
								Students
							</Link>
							<Link
								href={{
									pathname: `/course/${object?.data?._id}/comments`,
									query: {
										page: 1,
										limit: 10,
										sort: `-createdAt`,
									},
								}}
								className={`nav-link${isActive(
									`/course/${object?.data?._id}/comments`
								)}`}
							>
								Comments
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Menu;
