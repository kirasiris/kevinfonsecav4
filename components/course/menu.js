"use client";
import Link from "next/link";

const Menu = ({ object = {} }) => {
	return (
		<div className="bg-light mb-4">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<nav className="nav">
							<Link
								href={{
									pathname: `/course/${object?.data?._id}/${object?.data?.category}/${object?.data?.sub_category}/${object?.data?.slug}/index`,
									query: {},
								}}
								passHref
								legacyBehavior
							>
								<a className="nav-link active">Overview</a>
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
								passHref
								legacyBehavior
							>
								<a className="nav-link">Students</a>
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
								passHref
								legacyBehavior
							>
								<a className="nav-link">Comments</a>
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Menu;
