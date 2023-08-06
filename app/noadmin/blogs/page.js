import Image from "next/image";
import Link from "next/link";

const AdminBlogIndex = () => {
	return (
		<>
			<div className="bg-body-secondary mb-3 p-1">
				<Link
					href={{
						pathname: "/noadmin/blogs",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">All</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/published",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Published</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/draft",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Draft</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/scheduled",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Scheduled</a>
				</Link>
				<Link
					href={{
						pathname: "/noadmin/blogs/trashed",
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">Trashed</a>
				</Link>
			</div>
			<div className="card rounded-0">
				<div className="card-header">
					<Link
						href={{
							pathname: "/noadmin/blogs",
							query: { page: 1, limit: 10 },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm float-start">Blogs</a>
					</Link>
					<Link
						href={{
							pathname: "/noadmin/blogs/add",
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-danger btn-sm float-end">Add new blog</a>
					</Link>
				</div>
				<ul className="list-group list-group-flush">
					<li className="list-group-item">
						<div className="blog-item__panel">
							<div className="blog-item__detail">
								<div className="blog-item__info"></div>
								<h1 className="blog-item__title">
									<Link
										href={{
											pathname: "/noadmin/blogs/update/:ID",
											query: {},
										}}
										passHref
										legacyBehavior
									>
										<a className="blog-item__title-link">TITLE</a>
									</Link>
								</h1>
								<div className="blog-item__meta"></div>
							</div>
							<div className="blog-type-list__blog-thumbnail-wrapper has-image">
								<Link
									href={{
										pathname: "/noadmin/blogs/update/:ID",
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="blog-type-list__blog-thumbnail-link">
										<Image
											src="https://i0.wp.com/befreebucket-for-outputs.s3.amazonaws.com/2023/04/Changelog.jpg?ssl=1&h=160"
											className="blog-type-list__blog-thumbnail"
											alt="Blog titles image"
											width="83"
											height="63"
										/>
									</a>
								</Link>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</>
	);
};

export default AdminBlogIndex;
