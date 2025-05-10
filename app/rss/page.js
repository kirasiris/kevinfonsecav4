import Link from "next/link";
import { MdRssFeed } from "react-icons/md";
import Header from "@/layout/header";

const RSSIndex = async ({ params, searchParams }) => {
	return (
		<>
			<Header
				title="Welcome to my RSS Feeds"
				description="You can easily exports my articles without having to use an API!"
			/>
			<div className="container">
				<div className="row">
					<div className="col">
						<div className="card mb-3">
							<div className="card-header">Blogs</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									Sitemap:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/sitemap.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
								<li className="list-group-item">
									Feed:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/feed.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="col">
						<div className="card mb-3">
							<div className="card-header">Themes</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									Sitemap:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/theme/sitemap.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
								<li className="list-group-item">
									Feed:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/theme/feed.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="col">
						<div className="card mb-3">
							<div className="card-header">Secrets</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									Sitemap:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/secret/sitemap.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
								<li className="list-group-item">
									Feed:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/secret/feed.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="col">
						<div className="card mb-3">
							<div className="card-header">Forum</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									Sitemap:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forum/sitemap.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
								<li className="list-group-item">
									Feed:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forum/feed.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="col">
						<div className="card mb-3">
							<div className="card-header">Jobs</div>
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									Sitemap:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/job/sitemap.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
								<li className="list-group-item">
									Feed:&nbsp;
									<Link
										href={{
											pathname: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/job/feed.xml`,
											query: {},
										}}
										className="btn btn-outline-secondary btn-sm"
										rel="noreferrer"
										target="_blank"
									>
										<MdRssFeed color="#ee802f" size="25px" />
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RSSIndex;
